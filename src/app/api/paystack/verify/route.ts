import { NextRequest, NextResponse } from 'next/server';
import { updateLeadStatus, getLeadByReference } from '@/lib/storage';
import { updateLeadInDB } from '@/lib/mongodb-storage';
import { incrementCouponUsage } from '@/lib/coupons';
import { sendPurchaseConfirmation, sendAdminNotification } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { status: false, message: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { status: false, message: 'Payment configuration error' },
        { status: 500 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Update lead status to failed
      updateLeadStatus(reference, 'failed');
      await updateLeadInDB(reference, 'failed');
      return NextResponse.json(
        { status: false, message: data.message || 'Failed to verify payment' },
        { status: response.status }
      );
    }

    // Update lead status based on payment result
    if (data.status && data.data.status === 'success') {
      const paidAt = new Date().toISOString();
      updateLeadStatus(reference, 'paid', paidAt);
      
      // Also update in MongoDB
      await updateLeadInDB(reference, 'paid', paidAt);
      
      console.log('Payment verified successfully:', {
        email: data.data.customer.email,
        amount: data.data.amount,
        reference: data.data.reference,
        metadata: data.data.metadata,
      });

      // Get lead details for email
      const lead = getLeadByReference(reference);
      
      if (lead) {
        // Increment coupon usage if coupon was used
        const couponCode = data.data.metadata?.couponCode;
        if (couponCode) {
          try {
            incrementCouponUsage(couponCode, lead.email);
            console.log(`Coupon ${couponCode} usage incremented for ${lead.email}`);
          } catch (error) {
            console.error('Failed to increment coupon usage:', error);
          }
        }

        // Send confirmation email to customer
        sendPurchaseConfirmation({
          fullName: lead.fullName,
          email: lead.email,
          package: lead.package,
          amount: lead.amount,
          reference: lead.reference,
        }).catch(err => console.error('Failed to send customer email:', err));

        // Send notification to admin
        sendAdminNotification({
          fullName: lead.fullName,
          email: lead.email,
          package: lead.package,
          amount: lead.amount,
          reference: lead.reference,
        }).catch(err => console.error('Failed to send admin email:', err));
      }
    } else {
      updateLeadStatus(reference, 'failed');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
