import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Church, HeartHandshake, Sparkles, Trophy, Star, Medal, CheckCircle2, Heart, Rocket } from 'lucide-react';

const slides = [
  {
    title: 'خدمتك في إيدك',
    description: 'تابع أحداث الخدمة، سجّل حضورك، واكسب نقاط مميزة مع كل خطوة',
    illustration: (
      <div className="w-52 h-52 flex items-center justify-center">
        <div className="relative">
          <div className="w-40 h-40 rounded-[2.5rem] bg-[#014761]/10 flex items-center justify-center">
            <div className="w-28 h-28 rounded-[2rem] bg-[#014761]/20 flex items-center justify-center">
              <Church size={56} color="#014761" />
            </div>
          </div>
          {/* Floating elements */}
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-[#014761] flex items-center justify-center shadow-lg">
            <HeartHandshake size={22} color="white" />
          </div>
          <div className="absolute -bottom-3 -left-3 w-10 h-10 rounded-xl bg-[#00C271] flex items-center justify-center shadow-lg">
            <Sparkles size={18} color="white" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'اكسب وتقدّم',
    description: 'كل حضور وكل مهمة = نقاط. تنافس مع أصدقائك وكن في القمة دائماً',
    illustration: (
      <div className="w-52 h-52 flex items-center justify-center">
        <div className="relative">
          <div className="w-40 h-40 rounded-[2.5rem] bg-[#00C271]/15 flex items-center justify-center">
            <div className="w-28 h-28 rounded-[2rem] bg-[#00C271]/25 flex items-center justify-center">
              <Trophy size={56} color="#00C271" />
            </div>
          </div>
          <div className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-[#014761] flex items-center justify-center shadow-lg">
            <Star size={22} color="white" fill="white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[#0F2030] flex items-center justify-center shadow-lg">
            <Medal size={18} color="white" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'جاهز؟',
    description: 'انضم لمجتمع الشباب وابدأ رحلتك الروحية معنا الآن',
    illustration: (
      <div className="w-52 h-52 flex items-center justify-center">
        <div className="relative">
          <div className="w-40 h-40 rounded-[2.5rem] bg-[#014761]/10 flex items-center justify-center">
            <div className="w-28 h-28 rounded-[2rem] bg-[#014761]/20 flex items-center justify-center">
              <Rocket size={56} color="#014761" />
            </div>
          </div>
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-[#00C271] flex items-center justify-center shadow-lg">
            <CheckCircle2 size={22} color="white" />
          </div>
          <div className="absolute -bottom-3 -left-3 w-10 h-10 rounded-xl bg-[#014761] flex items-center justify-center shadow-lg">
            <Heart size={18} color="white" fill="white" />
          </div>
        </div>
      </div>
    ),
  },
];

export function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const goNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/login');
    }
  };

  const skip = () => navigate('/login');

  return (
    <div className="flex flex-col h-full bg-[#F2F3F2]">
      {/* Skip button */}
      <div className="flex justify-between items-center px-6 pt-6">
        <button
          onClick={skip}
          className="text-[#7A7A7A] py-2 px-3 rounded-2xl"
          style={{ fontSize: '0.85rem' }}
        >
          تخطي
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-[#014761]' : 'w-1.5 bg-[#014761]/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-8"
          >
            {slides[current].illustration}

            <div className="flex flex-col gap-3">
              <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                {slides[current].title}
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed" style={{ fontSize: '0.95rem' }}>
                {slides[current].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-6 pb-10 flex flex-col gap-3">
        {current === slides.length - 1 ? (
          <>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-2xl bg-[#014761] text-white shadow-md active:scale-95 transition-transform"
              style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 16px rgba(1, 71, 97, 0.35)' }}
            >
              سجّل دخول
            </button>
            <p className="text-center text-[#7A7A7A]" style={{ fontSize: '0.8rem' }}>
              ليس لديك حساب؟{' '}
              <span className="text-[#014761]">تواصل مع الإدارة لتسجيلك</span>
            </p>
          </>
        ) : (
          <button
            onClick={goNext}
            className="w-full py-4 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
            style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 16px rgba(1, 71, 97, 0.35)' }}
          >
            <span>التالي</span>
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
    </div>
  );
}