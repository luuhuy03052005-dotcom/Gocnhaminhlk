import type { ConfirmationResult, User, MultiFactorError } from 'firebase/auth';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { isCustomerApiConfigured, CustomerApiError } from './customerApi';

export interface AuthSession {
  id: string;
  firebaseUid: string;
  phoneNumber: string;
  fullName: string;
  role: string;
}

export interface OtpState {
  confirmation: ConfirmationResult;
  maskedPhone: string;
}

let recaptchaVerifier: RecaptchaVerifier | null = null;
let otpState: OtpState | null = null;

function getRecaptchaVerifier(): RecaptchaVerifier {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {},
      'expired-callback': () => {
        recaptchaVerifier = null;
      },
    });
  }
  return recaptchaVerifier;
}

export function getMaskedPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 7) return phone;
  return phone.slice(0, -7) + '*******'.slice(-7);
}

export async function sendOtp(phone: string): Promise<OtpState> {
  const verifier = getRecaptchaVerifier();
  const confirmation = await signInWithPhoneNumber(auth, phone, verifier);

  otpState = {
    confirmation,
    maskedPhone: getMaskedPhone(phone),
  };

  return otpState;
}

export async function verifyOtp(otp: string): Promise<User> {
  if (!otpState) {
    throw new Error('NO_OTP_SENT');
  }

  try {
    const result = await otpState.confirmation.confirm(otp);
    otpState = null;
    return result.user;
  } catch (error) {
    const mfaError = error as MultiFactorError;
    if (mfaError?.code === 'auth/multi-factor-auth-required') {
      throw new Error('MFA_REQUIRED');
    }
    throw new Error('INVALID_OTP');
  }
}

export async function createCustomerSession(user: User): Promise<AuthSession> {
  if (!isCustomerApiConfigured) {
    throw new Error('API_NOT_CONFIGURED');
  }

  const idToken = await user.getIdToken();

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      firebaseIdToken: idToken,
      clientType: 'WEB_CUSTOMER',
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { code?: string; message?: string } };
    throw new CustomerApiError(
      body.error?.code ?? 'SESSION_CREATE_FAILED',
      body.error?.message ?? 'Failed to create session',
      response.status,
    );
  }

  const body = (await response.json()) as { success: boolean; data: AuthSession; error?: { code?: string; message?: string } };
  if (!body.success) {
    throw new CustomerApiError(
      body.error?.code ?? 'SESSION_CREATE_FAILED',
      body.error?.message ?? 'Failed to create session',
      response.status,
    );
  }

  return body.data;
}

export function clearOtpState() {
  otpState = null;
  recaptchaVerifier = null;
}

export function resetRecaptcha() {
  recaptchaVerifier = null;
}
