import { NextResponse } from 'next/server';
import { generateReferralLink, trackReferralEarnings } from '@/lib/referrals';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const referralLink = await generateReferralLink(userId);
    return NextResponse.json({ referralLink });
}

export async function POST(request: Request) {
    const { userId, amount } = await request.json();

    if (!userId || !amount) {
        return NextResponse.json({ error: 'User ID and amount are required' }, { status: 400 });
    }

    const earnings = await trackReferralEarnings({ userId, amount });
    return NextResponse.json({ earnings });
}