import type { CustomerProfile } from '../contexts/AuthContext';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = rawApiBaseUrl ? rawApiBaseUrl.replace(/\/+$/, '') : '';
const hasApiVersionPrefix = /\/api\/v1$/i.test(apiBaseUrl);

export const isCustomerApiConfigured = Boolean(apiBaseUrl && hasApiVersionPrefix);

interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: unknown;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: ApiErrorBody;
}

async function requestCustomer<T>(
  path: string,
  firebaseToken: string,
  options?: RequestInit,
): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('API_NOT_CONFIGURED');
  }

  if (!hasApiVersionPrefix) {
    throw new Error('API_BASE_URL_MUST_INCLUDE_API_V1');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${firebaseToken}`,
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiResponse<never>;
    throw new CustomerApiError(
      body.error?.code ?? 'REQUEST_FAILED',
      body.error?.message ?? 'Request failed',
      response.status,
    );
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (!body.success) {
    throw new CustomerApiError(
      body.error?.code ?? 'REQUEST_FAILED',
      body.error?.message ?? 'Request failed',
      response.status,
    );
  }

  return body.data;
}

export class CustomerApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'CustomerApiError';
    this.code = code;
    this.status = status;
  }
}

export const customerApi = {
  getProfile: (token: string) =>
    requestCustomer<CustomerProfile>('/customer/profile', token),

  updateProfile: (token: string, body: { fullName?: string; avatarUrl?: string }) =>
    requestCustomer<CustomerProfile>('/customer/profile', token, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  getVouchers: (token: string) =>
    requestCustomer<CustomerVoucher[]>('/customer/vouchers', token),

  getNotifications: (token: string) =>
    requestCustomer<CustomerNotification[]>('/customer/notifications', token),

  markNotificationRead: (token: string, notificationId: string) =>
    requestCustomer<CustomerNotification>(
      `/customer/notifications/${notificationId}/read`,
      token,
      { method: 'PATCH' },
    ),

  getPoints: (token: string) =>
    requestCustomer<{ balance: number; transactions: unknown[] }>('/customer/points', token),
};

export interface CustomerVoucher {
  id: string;
  userId: string;
  voucherId: string;
  status: 'UNUSED' | 'USED' | 'EXPIRED' | 'LOCKED';
  assignedAt: string;
  usedAt?: string;
  voucher?: {
    id: string;
    title: string;
    description?: string;
    type: 'PERCENT' | 'FIXED_AMOUNT';
    value: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    startDate: string;
    endDate: string;
    status: string;
  };
}

export interface CustomerNotification {
  id: string;
  notificationId: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  notification?: {
    id: string;
    title: string;
    content: string;
    type: 'SYSTEM' | 'PROMOTION' | 'ORDER' | 'VOUCHER';
    targetType: 'ALL' | 'USER' | 'GROUP';
    createdAt: string;
  };
}
