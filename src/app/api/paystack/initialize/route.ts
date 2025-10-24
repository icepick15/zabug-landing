import { NextRequest, NextResponse } from 'next/server';
import { addLead } from '@/lib/storage';
import { saveLeadToDB } from '@/lib/mongodb-storage';
import { incrementCouponUsage } from '@/lib/coupons';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, metadata } = body;
    const fullName = metadata?.fullName || '';
    const phone = metadata?.phone || '';
    const packageName = metadata?.planName || metadata?.package || '';
    const couponCode = metadata?.couponCode || null;

    if (!email || !amount || !fullName) {
      return NextResponse.json(
        { status: false, message: 'Email, full name, and amount are required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error('PAYSTACK_SECRET_KEY is not set in environment variables');
      return NextResponse.json(
        { status: false, message: 'Payment configuration error' },
        { status: 500 }
      );
    }

    // Generate reference
    const reference = `ECOM${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Save lead information first
    const lead = {
      id: reference,
      fullName,
      email,
      phone,
      package: packageName,
      amount: amount / 100, // Convert from kobo to naira
      status: 'pending' as const,
      reference,
      createdAt: new Date().toISOString(),
    };

    addLead(lead);
    
    // Also save to MongoDB
    await saveLeadToDB(lead);

    // Initialize Paystack payment
    console.log('Initializing Paystack payment with:', {
      email,
      amount,
      reference,
      secretKeyPrefix: secretKey.substring(0, 10) + '...'
    });

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount, // Amount in kobo
        reference,
        metadata: {
          fullName,
          phone,
          package: packageName,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?reference=${reference}`,
        channels: ['card', 'bank', 'ussd', 'bank_transfer'],
      }),
    });

    const data = await response.json();

    console.log('Paystack response status:', response.status);
    console.log('Paystack response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Paystack API error:', data);
      return NextResponse.json(
        { status: false, message: data.message || 'Failed to initialize payment', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
