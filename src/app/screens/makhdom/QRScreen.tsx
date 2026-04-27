import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, RefreshCw, Sun, CheckCircle2, Star, Timer, Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { currentUser } from '../../data/mockData';

export function QRScreen() {
  const navigate = useNavigate();
  const user = currentUser.makhdom;
  const [timeLeft, setTimeLeft] = useState(300); // 5 min
  const [brightness, setBrightness] = useState(80);
  const [scanned, setScanned] = useState(false);
  const qrValue = `amin-khidma:user:${user.id}:${Date.now()}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) return 300;
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Demo: simulate QR scan after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setScanned(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (scanned) {
    return (
      <div className="flex flex-col h-full bg-[#FAF6ED] items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="w-28 h-28 rounded-full bg-[#014761] flex items-center justify-center"
            style={{ boxShadow: '0 8px 32px rgba(1, 71, 97, 0.35)' }}>
            <CheckCircle2 size={56} color="white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.4rem', fontWeight: 700 }}>تم تسجيل حضورك!</h2>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <p className="text-[#6B6B6B]" style={{ fontSize: '0.9rem' }}>مبروك عليك الحضور</p>
              <Sparkles size={16} color="#00C271" />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#014761]/10 px-5 py-3 rounded-2xl">
            <span className="text-[#014761]" style={{ fontSize: '1.2rem', fontWeight: 800 }}>+10</span>
            <span className="text-[#014761]" style={{ fontSize: '0.9rem', fontWeight: 600 }}>نقاط مكتسبة</span>
            <Star size={14} color="#014761" fill="#014761" />
          </div>
          <button
            onClick={() => navigate('/makhdom/home')}
            className="w-full py-4 rounded-2xl bg-[#014761] text-white"
            style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 16px rgba(1, 71, 97, 0.35)' }}
          >
            العودة للرئيسية
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F2F3F2]">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <ChevronRight size={20} color="white" />
          </button>
          <h1 className="text-white" style={{ fontSize: '1.1rem', fontWeight: 700 }}>بطاقتي الشخصية</h1>
          <div className="w-10 h-10" />
        </div>
        <div className="text-center">
          <p className="text-white/90" style={{ fontSize: '1rem', fontWeight: 600 }}>{user.name}</p>
          <p className="text-white/70" style={{ fontSize: '0.8rem' }}>مخدوم</p>
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 flex flex-col items-center gap-6">
        {/* QR Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white rounded-3xl p-6 flex flex-col items-center gap-4"
          style={{ boxShadow: '0 8px 32px rgba(1, 71, 97, 0.12)' }}
        >
          <div className="bg-white rounded-2xl p-3 border-2 border-[#C8EDE5]">
            <QRCodeDisplay value={qrValue} size={220} />
          </div>

          <p className="text-[#6B6B6B] text-center" style={{ fontSize: '0.82rem' }}>
            اعرض هذا الكود ليسجل أحد الخدام حضورك
          </p>

          {/* Timer */}
          <div className="flex items-center gap-2 bg-[#F2F3F2] px-4 py-2 rounded-full">
            <Timer size={14} color="#014761" />
            <span className="text-[#4A4A4A]" style={{ fontSize: '0.82rem' }}>
              صالح لمدة{' '}
              <span className="text-[#014761]" style={{ fontWeight: 700 }}>
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </span>
            <button
              onClick={() => setTimeLeft(300)}
              className="w-6 h-6 rounded-full bg-[#014761]/10 flex items-center justify-center mr-1"
            >
              <RefreshCw size={12} color="#014761" />
            </button>
          </div>
        </motion.div>

        {/* Brightness Control */}
        <div className="w-full bg-white rounded-2xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.06)' }}>
          <div className="flex items-center gap-3">
            <Sun size={16} color="#C4C4C4" />
            <input
              type="range"
              min={20}
              max={100}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="flex-1 accent-[#014761]"
            />
            <Sun size={20} color="#014761" />
          </div>
        </div>

        {/* Demo Hint */}
        <div className="bg-[#014761]/8 rounded-2xl p-3 w-full flex items-center justify-center gap-2">
          <Lightbulb size={14} color="#0F2030" />
          <p className="text-[#0F2030]" style={{ fontSize: '0.75rem' }}>
            للتجربة: سيتم محاكاة المسح تلقائياً بعد 4 ثوانٍ
          </p>
        </div>
      </div>
    </div>
  );
}