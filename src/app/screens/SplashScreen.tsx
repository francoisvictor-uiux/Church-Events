import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#014761]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        {/* Logo */}
        <div className="w-24 h-24 rounded-[2rem] bg-white/20 flex items-center justify-center shadow-lg">
          <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 4L32 30H4L18 4Z" fill="#014761" stroke="#014761" strokeWidth="1" strokeLinejoin="round"/>
              <path d="M18 10L28 28H8L18 10Z" fill="white" opacity="0.3"/>
              <circle cx="18" cy="20" r="5" fill="#014761"/>
              <path d="M16 4H20V14H16V4Z" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-white" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.02em' }}>
            أمين الخدمة
          </h1>
          <p className="text-white/70 mt-1" style={{ fontSize: '0.9rem' }}>
            خدمتك في إيدك
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-16 flex gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full bg-white ${i === 0 ? 'w-6 opacity-100' : 'w-1.5 opacity-40'}`}
          />
        ))}
      </motion.div>
    </div>
  );
}