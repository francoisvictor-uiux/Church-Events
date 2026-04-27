import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Phone, Hand, Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';

export function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const cleaned = phone.replace(/\s/g, '');
    if (!/^01[0125][0-9]{8}$/.test(cleaned)) {
      setError('أدخل رقم مصري صحيح مكون من 11 رقم يبدأ بـ 01');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      navigate('/otp', { state: { phone } });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F3F2]">
      {/* Header */}
      <div className="flex flex-col items-center pt-16 pb-8 px-6">
        <div className="w-16 h-16 rounded-[1.5rem] bg-[#014761] flex items-center justify-center mb-6 shadow-lg" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.3)' }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <path d="M18 4L32 30H4L18 4Z" fill="white" opacity="0.5"/>
            <path d="M16 4H20V16H16V4Z" fill="white"/>
            <circle cx="18" cy="22" r="5" fill="white"/>
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-[#1C1C1C]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            مرحباً بعودتك
          </h1>
          <Hand size={22} color="#014761" />
        </div>
        <p className="text-[#7A7A7A] mt-2 text-center" style={{ fontSize: '0.9rem' }}>
          أدخل رقم هاتفك للمتابعة
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        <div className="flex flex-col gap-5">
          {/* Phone input */}
          <div className="flex flex-col gap-2">
            <label className="text-[#3D3D3D]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              رقم الهاتف
            </label>
            <div className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border-2 transition-colors ${
              error ? 'border-red-400' : 'border-transparent'
            }`} style={{ boxShadow: '0 2px 8px rgba(1, 71, 97, 0.06)' }}>
              <div className="flex items-center gap-2 border-l pl-3" style={{ borderColor: '#A8DFD0' }}>
                <span className="text-[#3D3D3D]" style={{ fontSize: '0.9rem', fontWeight: 600 }}>EG</span>
                <span className="text-[#3D3D3D]" style={{ fontSize: '0.9rem', fontWeight: 600 }}>+20</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                placeholder="01X XXXX XXXX"
                className="flex-1 bg-transparent outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                style={{ fontSize: '1rem', direction: 'ltr', textAlign: 'right' }}
                maxLength={11}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <Phone size={18} color="#C4C4C4" />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-right"
                style={{ fontSize: '0.78rem' }}
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-[#014761] text-white active:scale-95 transition-transform"
            style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 16px rgba(1, 71, 97, 0.35)' }}
          >
            إرسال رمز التأكيد
          </button>

          {/* Demo Role Selector */}
          <div className="mt-2 p-4 rounded-2xl bg-[#014761]/8 border border-[#014761]/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Gamepad2 size={14} color="#0F2030" />
              <p className="text-center text-[#0F2030]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                وضع العرض — اختر دورك لتجربة التطبيق
              </p>
            </div>
            <div className="flex gap-2">
              {[
                { label: 'مخدوم', path: '/makhdom/home' },
                { label: 'خادم', path: '/khadem/home' },
                { label: 'أمين', path: '/admin/dashboard' },
              ].map((role) => (
                <button
                  key={role.label}
                  onClick={() => navigate(role.path)}
                  className="flex-1 py-2.5 rounded-xl bg-[#014761] text-white active:scale-95 transition-transform"
                  style={{ fontSize: '0.8rem', fontWeight: 600 }}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-10 text-center">
        <p className="text-[#7A7A7A]" style={{ fontSize: '0.82rem' }}>
          ليس لديك حساب؟{' '}
          <span className="text-[#014761]" style={{ fontWeight: 600 }}>
            تواصل مع الإدارة لتسجيلك
          </span>
        </p>
      </div>
    </div>
  );
}