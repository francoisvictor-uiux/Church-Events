import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronRight, Timer, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

export function OTPScreen() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [shake, setShake] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '01012345678';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDigit = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newDigits.every((d) => d !== '')) {
      setTimeout(() => handleVerify(newDigits), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (d = digits) => {
    const code = d.join('');
    if (code === '123456' || code.length === 6) {
      navigate('/makhdom/home');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const maskedPhone = phone.slice(0, 3) + '●●●●' + phone.slice(-4);

  return (
    <div className="flex flex-col h-full bg-[#F2F3F2]">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2">
        <button onClick={() => navigate('/login')} className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <ChevronRight size={20} color="#3D3D3D" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-8">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-[#1C1C1C]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            أدخل رمز التأكيد
          </h1>
          <p className="text-[#7A7A7A]" style={{ fontSize: '0.9rem' }}>
            تم إرسال رمز مكون من 6 أرقام إلى
          </p>
          <p className="text-[#014761]" style={{ fontSize: '0.95rem', fontWeight: 600, direction: 'ltr', textAlign: 'right' }}>
            {maskedPhone}
          </p>
        </div>

        {/* OTP Inputs */}
        <motion.div
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex justify-center gap-3 mb-8"
          style={{ direction: 'ltr' }}
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center rounded-2xl bg-white border-2 outline-none transition-all text-[#1C1C1C] ${
                digit ? 'border-[#014761] bg-[#014761]/5' : 'border-transparent'
              }`}
              style={{ fontSize: '1.4rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            />
          ))}
        </motion.div>

        {/* Timer */}
        <div className="text-center mb-6">
          {!canResend ? (
            <div className="flex items-center justify-center gap-1.5">
              <Timer size={14} color="#7A7A7A" />
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.9rem' }}>
                إعادة الإرسال بعد{' '}
                <span className="text-[#014761]" style={{ fontWeight: 600 }}>
                  00:{timer.toString().padStart(2, '0')}
                </span>
              </p>
            </div>
          ) : (
            <button
              onClick={() => {
                setTimer(60);
                setCanResend(false);
                setDigits(['', '', '', '', '', '']);
              }}
              className="text-[#014761]"
              style={{ fontWeight: 600, fontSize: '0.9rem' }}
            >
              أعد الإرسال
            </button>
          )}
        </div>

        <button
          onClick={() => handleVerify()}
          className="w-full py-4 rounded-2xl bg-[#014761] text-white"
          style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 16px rgba(1, 71, 97, 0.35)' }}
        >
          تأكيد
        </button>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Lightbulb size={13} color="#7A7A7A" />
          <p className="text-center text-[#7A7A7A]" style={{ fontSize: '0.78rem' }}>
            للتجربة: أدخل أي 6 أرقام للدخول
          </p>
        </div>
      </div>
    </div>
  );
}