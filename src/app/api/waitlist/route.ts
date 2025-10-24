import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist, getAllWaitlistEntries } from '@/lib/storage';
import { saveWaitlistToDB } from '@/lib/mongodb-storage';
import { sendWaitlistConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { status: false, message: 'Full name, email, and phone number are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { status: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    const entry = {
      id: `WL_${Date.now()}`,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      addToWaitlist(entry);
      
      // Also save to MongoDB
      await saveWaitlistToDB(entry);
      
      // Send confirmation email
      sendWaitlistConfirmation({
        fullName: entry.fullName,
        email: entry.email,
      }).catch(err => console.error('Failed to send waitlist email:', err));
      
      return NextResponse.json({
        status: true,
        message: 'Successfully joined the waitlist!',
        data: { id: entry.id },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already registered')) {
        return NextResponse.json(
          { status: false, message: 'This email is already on the waitlist' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple authentication
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_KEY || 'admin123';
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const waitlist = getAllWaitlistEntries();
    
    return NextResponse.json({
      status: true,
      data: waitlist,
      total: waitlist.length,
    });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
