import fs from 'fs';
import path from 'path';

const COUPONS_FILE = path.join(process.cwd(), 'data', 'coupons.json');

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  active: boolean;
  appliesTo: string[];
  description: string;
  usedBy?: string[]; // Track emails that used this coupon
}

// Ensure coupons file exists
function ensureCouponsFile() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(COUPONS_FILE)) {
    fs.writeFileSync(COUPONS_FILE, JSON.stringify([], null, 2));
  }
}

// Get all coupons
export function getAllCoupons(): Coupon[] {
  ensureCouponsFile();
  try {
    const data = fs.readFileSync(COUPONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading coupons:', error);
    return [];
  }
}

// Get coupon by code
export function getCouponByCode(code: string): Coupon | null {
  const coupons = getAllCoupons();
  return coupons.find(c => c.code.toLowerCase() === code.toLowerCase()) || null;
}

// Validate coupon
export function validateCoupon(code: string, planId: string, email?: string): {
  valid: boolean;
  message: string;
  coupon?: Coupon;
  discount?: number;
} {
  const coupon = getCouponByCode(code);

  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }

  if (!coupon.active) {
    return { valid: false, message: 'This coupon is no longer active' };
  }

  // Check expiration
  const now = new Date();
  const expiryDate = new Date(coupon.expiresAt);
  if (now > expiryDate) {
    return { valid: false, message: 'This coupon has expired' };
  }

  // Check usage limit
  if (coupon.currentUses >= coupon.maxUses) {
    return { valid: false, message: 'This coupon has reached its usage limit' };
  }

  // Check if applies to selected plan
  if (!coupon.appliesTo.includes(planId)) {
    return { valid: false, message: 'This coupon is not valid for the selected package' };
  }

  // Check if user already used this coupon
  if (email && coupon.usedBy && coupon.usedBy.includes(email.toLowerCase())) {
    return { valid: false, message: 'You have already used this coupon' };
  }

  return {
    valid: true,
    message: 'Coupon applied successfully!',
    coupon,
    discount: coupon.value,
  };
}

// Calculate discounted price
export function calculateDiscount(originalPrice: number, coupon: Coupon): {
  originalPrice: number;
  discount: number;
  finalPrice: number;
} {
  let discount = 0;

  if (coupon.type === 'percentage') {
    discount = Math.round((originalPrice * coupon.value) / 100);
  } else if (coupon.type === 'fixed') {
    discount = coupon.value;
  }

  // Ensure discount doesn't exceed original price
  discount = Math.min(discount, originalPrice);
  const finalPrice = originalPrice - discount;

  return {
    originalPrice,
    discount,
    finalPrice,
  };
}

// Increment coupon usage
export function incrementCouponUsage(code: string, email: string): void {
  ensureCouponsFile();
  const coupons = getAllCoupons();
  const couponIndex = coupons.findIndex(c => c.code.toLowerCase() === code.toLowerCase());

  if (couponIndex !== -1) {
    coupons[couponIndex].currentUses += 1;
    
    // Track email
    if (!coupons[couponIndex].usedBy) {
      coupons[couponIndex].usedBy = [];
    }
    if (!coupons[couponIndex].usedBy!.includes(email.toLowerCase())) {
      coupons[couponIndex].usedBy!.push(email.toLowerCase());
    }

    fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2));
    console.log(`Coupon ${code} usage incremented. Current uses: ${coupons[couponIndex].currentUses}`);
  }
}

// Add new coupon
export function addCoupon(coupon: Coupon): void {
  ensureCouponsFile();
  const coupons = getAllCoupons();
  
  // Check if code already exists
  const exists = coupons.some(c => c.code.toLowerCase() === coupon.code.toLowerCase());
  if (exists) {
    throw new Error('Coupon code already exists');
  }

  coupons.push({
    ...coupon,
    currentUses: 0,
    usedBy: [],
  });

  fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2));
}

// Update coupon
export function updateCoupon(code: string, updates: Partial<Coupon>): void {
  ensureCouponsFile();
  const coupons = getAllCoupons();
  const couponIndex = coupons.findIndex(c => c.code.toLowerCase() === code.toLowerCase());

  if (couponIndex === -1) {
    throw new Error('Coupon not found');
  }

  coupons[couponIndex] = { ...coupons[couponIndex], ...updates };
  fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2));
}

// Delete coupon
export function deleteCoupon(code: string): void {
  ensureCouponsFile();
  const coupons = getAllCoupons();
  const filtered = coupons.filter(c => c.code.toLowerCase() !== code.toLowerCase());
  fs.writeFileSync(COUPONS_FILE, JSON.stringify(filtered, null, 2));
}
