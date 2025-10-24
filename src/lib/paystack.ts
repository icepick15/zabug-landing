import crypto from 'crypto';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

type InitializeArgs = {
  email: string;
  amountInNaira: number;
  planId?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
};

type InitializeResponse = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

export class PaystackError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'PaystackError';
    this.status = status;
  }
}

const getSecretKey = () => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new PaystackError('Missing PAYSTACK_SECRET_KEY environment variable');
  }
  return key;
};

const formatAmount = (amountInNaira: number) => {
  if (Number.isNaN(amountInNaira)) {
    throw new PaystackError('Invalid amount supplied to Paystack initializer');
  }
  return Math.round(amountInNaira * 100);
};

export const initializeTransaction = async ({
  email,
  amountInNaira,
  planId,
  callbackUrl,
  metadata = {},
}: InitializeArgs): Promise<InitializeResponse> => {
  const secretKey = getSecretKey();
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: formatAmount(amountInNaira),
      callback_url: callbackUrl,
      plan: planId,
      metadata,
    }),
  });

  const payload = await response.json();

  if (!response.ok || !payload?.status) {
    throw new PaystackError(payload?.message ?? 'Unable to initialize Paystack transaction', response.status);
  }

  return {
    authorizationUrl: payload.data.authorization_url,
    accessCode: payload.data.access_code,
    reference: payload.data.reference,
  };
};

type VerifyResponse = {
  reference: string;
  status: 'success' | 'failed' | 'abandoned';
  amountInNaira: number;
  metadata: Record<string, unknown>;
  fees: number;
  paidAt: string;
  customer: {
    email: string;
    code: string;
  };
};

export const verifyTransaction = async (reference: string): Promise<VerifyResponse> => {
  const secretKey = getSecretKey();
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const payload = await response.json();

  if (!response.ok || !payload?.status) {
    throw new PaystackError(payload?.message ?? 'Unable to verify Paystack transaction', response.status);
  }

  const data = payload.data;

  return {
    reference: data.reference,
    status: data.status,
    amountInNaira: data.amount / 100,
    metadata: data.metadata ?? {},
    fees: data.fees / 100,
    paidAt: data.paid_at,
    customer: {
      email: data.customer?.email,
      code: data.customer?.customer_code,
    },
  };
};

export const computeSignature = (payload: string) => {
  const secretKey = getSecretKey();
  return crypto.createHmac('sha512', secretKey).update(payload).digest('hex');
};

export const isValidWebhookSignature = (payload: string, signature?: string | null) => {
  if (!signature) return false;
  return computeSignature(payload) === signature;
};
