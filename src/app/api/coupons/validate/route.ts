import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon, calculateDiscount } from '@/lib/coupons';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, planId, email } = body;

    if (!code || !planId) {
      return NextResponse.json(
        { status: false, message: 'Coupon code and plan ID are required' },
        { status: 400 }
      );
    }

    // Validate coupon
    const validation = validateCoupon(code, planId, email);

    if (!validation.valid || !validation.coupon) {
      return NextResponse.json(
        { status: false, message: validation.message },
        { status: 400 }
      );
    }

    // Get plan prices
    const plans: Record<string, { price: number; originalPrice: number }> = {
      'template': { price: 120000, originalPrice: 180000 },
      'template-setup': { price: 200000, originalPrice: 350000 }
    };

    const plan = plans[planId];
    if (!plan) {
      return NextResponse.json(
        { status: false, message: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Calculate discount on current price (not original)
    const discountCalculation = calculateDiscount(plan.price, validation.coupon);

    return NextResponse.json({
      status: true,
      message: validation.message,
      data: {
        code: validation.coupon.code,
        type: validation.coupon.type,
        value: validation.coupon.value,
        originalPrice: plan.price,
        discount: discountCalculation.discount,
        finalPrice: discountCalculation.finalPrice,
        description: validation.coupon.description,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
