import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_KEY || 'ajibade'; 
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const leads = getAllLeads();
    
    return NextResponse.json({
      status: true,
      data: leads,
      total: leads.length,
      paid: leads.filter(l => l.status === 'paid').length,
      pending: leads.filter(l => l.status === 'pending').length,
      failed: leads.filter(l => l.status === 'failed').length,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
