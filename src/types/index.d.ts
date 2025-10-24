// src/types/index.d.ts

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
  }
}

interface Referral {
  id: string;
  userId: string;
  referralCode: string;
  earnings: number;
  createdAt: Date;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
  createdAt: Date;
}

interface User {
  id: string;
  email: string;
  name: string;
  referrals: Referral[];
  payments: Payment[];
}