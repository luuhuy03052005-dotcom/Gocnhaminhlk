import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sendOtp, verifyOtp, resetRecaptcha } from '../services/authService';
import { cn } from '../utils/cn';
import { isCustomerApiConfigured } from '../services/customerApi';

type Step = 'phone' | 'otp' | 'loading';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = (seconds = 60) => {
    setCountdown(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Số điện thoại không hợp lệ.');
      return;
    }

    const fullPhone = cleanPhone.startsWith('0') ? `+84${cleanPhone.slice(1)}` : cleanPhone;
    setIsSending(true);

    try {
      const state = await sendOtp(fullPhone);
      setMaskedPhone(state.maskedPhone);
      setStep('otp');
      startCountdown(60);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gửi mã thất bại';
      if (msg === 'MISSING_RECAPTCHA_ELEMENT') {
        setError('Không thể hiển thị xác minh. Vui lòng thử lại.');
      } else {
        setError('Không thể gửi mã OTP. Vui lòng thử lại sau.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otp.replace(/\D/g, '').length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số.');
      return;
    }

    setIsVerifying(true);

    try {
      const firebaseUser = await verifyOtp(otp);
      await login(firebaseUser);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Xác minh thất bại';
      if (msg === 'INVALID_OTP') {
        setError('Mã OTP không đúng. Vui lòng thử lại.');
      } else if (msg === 'NO_OTP_SENT') {
        setError('Chưa có mã được gửi. Vui lòng gửi lại.');
        setStep('phone');
      } else {
        setError('Xác minh thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    resetRecaptcha();
    setOtp('');
    setError('');
    setStep('phone');
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <img
            src="https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,r_max,g_auto,f_webp,q_auto/v1/samples/animals/cat"
            alt="Logo"
            className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-[#EDE4D8]"
          />
          <h1 className="font-serif text-3xl font-bold text-[#2C2017]">Đăng nhập</h1>
          <p className="text-[#7A6A55] mt-2 text-sm">Nhận ưu đãi dành riêng cho bạn</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#EDE4D8] p-8">

          {/* No API warning */}
          {!isCustomerApiConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
              Chế độ demo — Backend chưa được kết nối. Bạn có thể trải nghiệm giao diện.
            </div>
          )}

          {/* Step: Phone */}
          {step === 'phone' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#2C2017] mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="088 988 8339"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE4D8] bg-[#FDF6EE] text-[#2C2017] placeholder:text-[#C8B8A2] focus:outline-none focus:ring-2 focus:ring-[#C8873A] focus:border-transparent transition-all"
                />
              </div>

              {/* reCAPTCHA container */}
              <div id="recaptcha-container" className="flex justify-center" />

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={isSending}
                className={cn(
                  'w-full py-3.5 rounded-xl font-bold text-white transition-all',
                  isSending
                    ? 'bg-[#C8B8A2] cursor-not-allowed'
                    : 'bg-[#C8873A] hover:bg-[#A06828] active:scale-[0.98]',
                )}
              >
                {isSending ? 'Đang gửi mã...' : 'Nhận mã OTP'}
              </button>
            </div>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-[#7A6A55] mb-1">Mã xác minh đã gửi đến</p>
                <p className="font-bold text-[#2C2017]">{maskedPhone}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C2017] mb-2">
                  Nhập mã OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="● ● ● ● ● ●"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE4D8] bg-[#FDF6EE] text-[#2C2017] text-center text-2xl tracking-[0.5em] font-mono placeholder:text-[#C8B8A2] focus:outline-none focus:ring-2 focus:ring-[#C8873A] focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-[#7A6A55]">
                <span>Không nhận được mã?</span>
                <button
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className={cn(
                    'font-semibold underline-offset-2',
                    countdown > 0
                      ? 'text-[#C8B8A2] cursor-not-allowed'
                      : 'text-[#C8873A] hover:underline',
                  )}
                >
                  {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
                </button>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying || otp.replace(/\D/g, '').length < 6}
                className={cn(
                  'w-full py-3.5 rounded-xl font-bold text-white transition-all',
                  isVerifying || otp.replace(/\D/g, '').length < 6
                    ? 'bg-[#C8B8A2] cursor-not-allowed'
                    : 'bg-[#C8873A] hover:bg-[#A06828] active:scale-[0.98]',
                )}
              >
                {isVerifying ? 'Đang xác minh...' : 'Xác minh'}
              </button>

              <button
                onClick={() => {
                  resetRecaptcha();
                  setOtp('');
                  setStep('phone');
                  setError('');
                }}
                className="w-full text-sm text-[#7A6A55] hover:text-[#2C2017] transition-colors"
              >
                ← Đổi số điện thoại
              </button>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-[#7A6A55] hover:text-[#C8873A] transition-colors"
          >
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
