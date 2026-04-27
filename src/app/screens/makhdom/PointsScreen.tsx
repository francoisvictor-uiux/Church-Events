import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Trophy, Star, Award, Lock, Medal, Flame, Gem, ClipboardList, Plus, Minus, Wallet, ArrowLeft } from 'lucide-react';
import { currentUser, leaderboard, pointTransactions, badges } from '../../data/mockData';

const levels = [
  { name: 'مبتدئ', min: 0, max: 100 },
  { name: 'نشيط', min: 100, max: 300 },
  { name: 'قائد', min: 300, max: 600 },
];

const BadgeIconComponent = ({ iconName, size = 24, color = '#014761' }: { iconName: string; size?: number; color?: string }) => {
  if (iconName === 'flame') return <Flame size={size} color={color} fill={color} />;
  if (iconName === 'gem') return <Gem size={size} color={color} />;
  if (iconName === 'star') return <Star size={size} color={color} fill={color} />;
  if (iconName === 'trophy') return <Trophy size={size} color={color} />;
  return <Award size={size} color={color} />;
};

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy size={20} color="#FFD700" fill="#FFD700" />;
  if (rank === 2) return <Medal size={20} color="#C0C0C0" />;
  if (rank === 3) return <Medal size={20} color="#CD7F32" />;
  return <span className="text-[#4A4A4A]" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rank}</span>;
};

const operationIcon = (op: string, color: string) => {
  if (op === 'add') return <Plus size={14} color={color} strokeWidth={3} />;
  if (op === 'subtract') return <Minus size={14} color={color} strokeWidth={3} />;
  return <Wallet size={14} color={color} />;
};

const operationColor = (op: string) => op === 'add' ? '#16A34A' : op === 'subtract' ? '#DC2626' : '#014761';

export function PointsScreen() {
  const user = currentUser.makhdom;
  const navigate = useNavigate();

  const currentLevel = levels.find((l) => user.points >= l.min && user.points < l.max) || levels[0];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const progressInLevel = user.points - currentLevel.min;
  const levelRange = currentLevel.max - currentLevel.min;
  const progress = (progressInLevel / levelRange) * 100;

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-8 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.25)' }}>
        <h1 className="text-white mb-5" style={{ fontSize: '1.3rem', fontWeight: 700 }}>نقاطي</h1>

        {/* Points Big Number */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          >
            <p className="text-white" style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>
              {user.points}
            </p>
          </motion.div>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <p className="text-white/80" style={{ fontSize: '0.9rem' }}>نقطة</p>
            <Trophy size={16} color="rgba(255,255,255,0.8)" />
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full mt-2">
            <Star size={14} color="#FBBF24" fill="#FBBF24" />
            <span className="text-white" style={{ fontSize: '0.82rem', fontWeight: 600 }}>مستوى {user.level}</span>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="bg-white/15 rounded-2xl px-4 py-3">
          <div className="flex justify-between mb-2">
            <span className="text-white/70" style={{ fontSize: '0.72rem' }}>{currentLevel.name}</span>
            <span className="text-white/70" style={{ fontSize: '0.72rem' }}>{nextLevel?.name || 'القمة'}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/60" style={{ fontSize: '0.68rem' }}>{currentLevel.min}</span>
            <span className="text-white/80" style={{ fontSize: '0.68rem' }}>
              {nextLevel ? `${nextLevel.min - user.points} للمستوى التالي` : 'أعلى مستوى!'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-5">
        {/* Badges */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>بادجات مكتسبة</h3>
          </div>
          <div className="flex gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl ${
                  badge.earned ? 'bg-[#F2F3F2]' : 'bg-[#F5F5F5] opacity-50'
                }`}
              >
                {badge.earned
                  ? <BadgeIconComponent iconName={badge.icon} size={26} color="#014761" />
                  : <Lock size={26} color="#9A9A9A" />
                }
                <span className="text-[#4A4A4A] text-center" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>الترتيب العام</h3>
          </div>
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-3 rounded-2xl ${
                  entry.isMe ? 'bg-[#014761]/8 border border-[#014761]/20' : 'bg-[#F2F3F2]'
                }`}
              >
                <div className="w-8 flex justify-center">
                  <RankIcon rank={entry.rank} />
                </div>
                <div className="w-9 h-9 rounded-full bg-[#014761] flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{entry.avatar}</span>
                </div>
                <span className={`flex-1 ${entry.isMe ? 'text-[#014761]' : 'text-[#1C1C1C]'}`} style={{ fontSize: '0.88rem', fontWeight: entry.isMe ? 700 : 500 }}>
                  {entry.name}
                </span>
                {entry.isMe && <ArrowLeft size={12} color="#014761" />}
                <div className="flex items-center gap-1">
                  <span className="text-[#4A4A4A]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{entry.points}</span>
                  <Star size={12} color="#FBBF24" fill="#FBBF24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList size={16} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>آخر المعاملات</h3>
          </div>
          <div className="flex flex-col gap-3">
            {pointTransactions.map((tx) => {
              const color = operationColor(tx.operation);
              return (
                <div key={tx.id} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    {operationIcon(tx.operation, color)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1C1C1C]" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{tx.reason}</p>
                    <p className="text-[#9A9A9A]" style={{ fontSize: '0.72rem' }}>{tx.date}</p>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>
                    {tx.operation === 'add' ? '+' : '-'}{tx.points}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}