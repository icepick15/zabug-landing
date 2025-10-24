import { randomUUID } from 'crypto';

const DEFAULT_COMMISSION_RATE = Number(process.env.NEXT_PUBLIC_REFERRAL_COMMISSION_RATE ?? 0.2);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

type ReferralProfile = {
  id: string;
  userId: string;
  referralCode: string;
  referralLink: string;
  totalSales: number;
  totalCommission: number;
  totalReferrals: number;
  pendingCommission: number;
  fulfilledCommission: number;
  createdAt: Date;
  updatedAt: Date;
};

type ReferralSale = {
  id: string;
  referrerUserId: string;
  amount: number;
  commissionEarned: number;
  status: 'pending' | 'paid';
  customerEmail?: string;
  paidAt?: Date;
  createdAt: Date;
};

type ReferralClick = {
  id: string;
  referrerUserId: string;
  referralCode: string;
  landingPage: string;
  userAgent?: string;
  ipAddress?: string;
  capturedAt: Date;
};

type ReferralEvent = ReferralSale | ReferralClick;

type ReferralStats = {
  totalSales: number;
  totalCommission: number;
  totalPaidCommission: number;
  pendingCommission: number;
  totalReferrals: number;
  recentSales: ReferralSale[];
};

const referralProfiles = new Map<string, ReferralProfile>();
const referralCodesToUser = new Map<string, string>();
const referralSales = new Map<string, ReferralSale>();
const referralEvents: ReferralEvent[] = [];

const createReferralProfile = (userId: string): ReferralProfile => {
  const referralCode = generateReferralCode(userId);
  const profile: ReferralProfile = {
    id: randomUUID(),
    userId,
    referralCode,
    referralLink: `${APP_URL}?ref=${referralCode}`,
    totalSales: 0,
    totalCommission: 0,
    totalReferrals: 0,
    pendingCommission: 0,
    fulfilledCommission: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  referralProfiles.set(userId, profile);
  referralCodesToUser.set(referralCode, userId);
  return profile;
};

export const getReferralProfile = (userId: string): ReferralProfile => {
  const existing = referralProfiles.get(userId);
  if (existing) return existing;
  return createReferralProfile(userId);
};

export const generateReferralCode = (userId: string) => {
  const uniqueSegment = randomUUID().split('-')[0].toUpperCase();
  return `${userId.slice(0, 4).toUpperCase()}-${uniqueSegment}`;
};

export const generateReferralLink = async (userId: string) => {
  return getReferralProfile(userId).referralLink;
};

type TrackReferralArgs = {
  userId: string;
  amount: number;
  commissionRate?: number;
  customerEmail?: string;
  markPaid?: boolean;
};

const computeCommission = (amount: number, rate: number) => {
  const normalizedAmount = Math.max(Number(amount) || 0, 0);
  return Number((normalizedAmount * rate).toFixed(2));
};

export const trackReferralEarnings = async ({
  userId,
  amount,
  commissionRate,
  customerEmail,
  markPaid = false,
}: TrackReferralArgs) => {
  const profile = getReferralProfile(userId);
  const rate = commissionRate ?? DEFAULT_COMMISSION_RATE;
  const commission = computeCommission(amount, rate);

  const sale: ReferralSale = {
    id: randomUUID(),
    referrerUserId: userId,
    amount,
    commissionEarned: commission,
    status: markPaid ? 'paid' : 'pending',
    customerEmail,
    paidAt: markPaid ? new Date() : undefined,
    createdAt: new Date(),
  };

  referralSales.set(sale.id, sale);
  referralEvents.unshift(sale);

  profile.totalSales = Number((profile.totalSales + amount).toFixed(2));
  profile.totalCommission = Number((profile.totalCommission + commission).toFixed(2));
  profile.pendingCommission = Number(
    (profile.pendingCommission + (markPaid ? 0 : commission)).toFixed(2)
  );
  profile.fulfilledCommission = Number(
    (profile.fulfilledCommission + (markPaid ? commission : 0)).toFixed(2)
  );
  profile.totalReferrals += 1;
  profile.updatedAt = new Date();

  referralProfiles.set(userId, profile);

  return {
    profile,
    sale,
  };
};

export const markReferralSaleAsPaid = (saleId: string) => {
  const sale = referralSales.get(saleId);
  if (!sale || sale.status === 'paid') return sale;

  sale.status = 'paid';
  sale.paidAt = new Date();
  referralSales.set(saleId, sale);

  const profile = getReferralProfile(sale.referrerUserId);
  profile.pendingCommission = Number(
    (profile.pendingCommission - sale.commissionEarned).toFixed(2)
  );
  profile.fulfilledCommission = Number(
    (profile.fulfilledCommission + sale.commissionEarned).toFixed(2)
  );
  profile.updatedAt = new Date();
  referralProfiles.set(profile.userId, profile);

  return sale;
};

export const logReferralClick = ({
  referralCode,
  landingPage,
  userAgent,
  ipAddress,
}: {
  referralCode: string;
  landingPage: string;
  userAgent?: string;
  ipAddress?: string;
}) => {
  const userId = referralCodesToUser.get(referralCode);
  if (!userId) return null;

  const event: ReferralClick = {
    id: randomUUID(),
    referrerUserId: userId,
    referralCode,
    landingPage,
    userAgent,
    ipAddress,
    capturedAt: new Date(),
  };

  referralEvents.unshift(event);

  const profile = getReferralProfile(userId);
  profile.totalReferrals += 1;
  profile.updatedAt = new Date();
  referralProfiles.set(userId, profile);

  return event;
};

export const resolveReferrerByCode = (referralCode: string) => {
  const userId = referralCodesToUser.get(referralCode);
  if (!userId) return null;
  return getReferralProfile(userId);
};

export const getReferralStats = (userId: string): ReferralStats => {
  const profile = getReferralProfile(userId);
  const recentSales = Array.from(referralSales.values())
    .filter((sale) => sale.referrerUserId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    totalSales: profile.totalSales,
    totalCommission: profile.totalCommission,
    totalPaidCommission: profile.fulfilledCommission,
    pendingCommission: profile.pendingCommission,
    totalReferrals: profile.totalReferrals,
    recentSales,
  };
};

export const listReferralEvents = (userId: string) => {
  return referralEvents.filter((event) => event.referrerUserId === userId);
};

export const resetReferralStore = () => {
  referralProfiles.clear();
  referralCodesToUser.clear();
  referralSales.clear();
  referralEvents.length = 0;
};
