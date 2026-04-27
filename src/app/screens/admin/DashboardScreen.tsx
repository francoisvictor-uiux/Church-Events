import { useNavigate } from 'react-router';
import { ChevronLeft, TrendingUp, AlertTriangle, DollarSign, Users, CheckCircle2, Calendar, Wallet, Crown, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { currentUser, members, weeklyAttendance, fundTransactions } from '../../data/mockData';

const StatIcon = ({ icon, size = 18 }: { icon: string; size?: number }) => {
  if (icon === 'users') return <Users size={size} color="rgba(255,255,255,0.85)" />;
  if (icon === 'check') return <CheckCircle2 size={size} color="rgba(255,255,255,0.85)" />;
  if (icon === 'calendar') return <Calendar size={size} color="rgba(255,255,255,0.85)" />;
  if (icon === 'wallet') return <Wallet size={size} color="rgba(255,255,255,0.85)" />;
  return null;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const user = currentUser.admin;
  const warningMembers = members.filter((m) => m.status === 'warning');

  const stats = [
    { value: user.totalMembers, label: 'عضو', icon: 'users' },
    { value: `${user.attendanceRate}%`, label: 'حضور', icon: 'check' },
    { value: user.totalEvents, label: 'حدث', icon: 'calendar' },
    { value: `${user.fundBalance?.toLocaleString()}ج`, label: 'رصيد الصندوق', icon: 'wallet' },
  ];

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.25)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/70" style={{ fontSize: '0.78rem' }}>لوحة التحكم</p>
            <div className="flex items-center gap-2">
              <h1 className="text-white" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user.name}</h1>
              <Crown size={18} color="#FBBF24" fill="#FBBF24" />
            </div>
            <p className="text-white/60" style={{ fontSize: '0.75rem' }}>أمين الخدمة • يناير 2026</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <motion.div key={stat.label} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white/15 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatIcon icon={stat.icon} size={16} />
                <span className="text-white/70" style={{ fontSize: '0.72rem' }}>{stat.label}</span>
              </div>
              <p className="text-white" style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Quick Access */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/admin/events')} className="bg-[#014761] text-white rounded-2xl p-4 flex flex-col gap-2"
            style={{ boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
            <Calendar size={22} color="white" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>إضافة حدث</span>
          </button>
          <button onClick={() => navigate('/admin/users')} className="bg-white rounded-2xl p-4 flex flex-col gap-2"
            style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
            <Users size={22} color="#014761" />
            <span className="text-[#1C1C1C]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>إدارة المستخدمين</span>
          </button>
          <button onClick={() => navigate('/admin/points')}
            className="col-span-2 bg-white rounded-2xl p-4 flex items-center gap-3"
            style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
            <div className="w-10 h-10 rounded-2xl bg-[#014761]/10 flex items-center justify-center shrink-0">
              <Star size={20} color="#014761" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 700 }}>إعدادات النقاط</p>
              <p className="text-[#9A9A9A]" style={{ fontSize: '0.72rem' }}>معادلة التحويل ونقاط كل فعل</p>
            </div>
            <ChevronLeft size={16} color="#C4C4C4" />
          </button>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>الحضور — آخر 4 أسابيع</h3>
          </div>
          <div className="flex items-end justify-around gap-2" style={{ height: 120 }}>
            {weeklyAttendance.map((item, index) => (
              <div key={`bar-${index}`} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[#9A9A9A]" style={{ fontSize: '0.7rem', fontWeight: 600 }}>{item.percentage}%</span>
                <div className="w-full rounded-t-xl bg-[#014761]" style={{ height: `${(item.percentage / 100) * 72}px`, minHeight: 8 }} />
                <span className="text-[#9A9A9A]" style={{ fontSize: '0.65rem' }}>{item.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Members */}
        {warningMembers.length > 0 && (
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} color="#00C271" />
                <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>يحتاجون متابعة</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00C271]/15 text-[#0F2030]" style={{ fontSize: '0.68rem', fontWeight: 600 }}>{warningMembers.length}</span>
              </div>
              <button onClick={() => navigate('/admin/users')} className="text-[#014761] flex items-center gap-1" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                الكل <ChevronLeft size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {warningMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F2F3F2]">
                  <div className="w-10 h-10 rounded-full bg-[#00C271]/20 flex items-center justify-center">
                    <span className="text-[#0F2030]" style={{ fontSize: '1rem', fontWeight: 700 }}>{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1C1C1C]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{member.name}</p>
                    <p className="text-[#9A9A9A]" style={{ fontSize: '0.72rem' }}>غاب {member.daysAbsent} يوم</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-[#014761] text-white" style={{ fontSize: '0.72rem', fontWeight: 600 }}>تواصل</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fund Transactions */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign size={16} color="#014761" />
              <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>آخر المعاملات المالية</h3>
            </div>
            <button onClick={() => navigate('/admin/fund')} className="text-[#014761] flex items-center gap-1" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              الكل <ChevronLeft size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {fundTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${tx.direction === 'in' ? 'bg-[#16A34A]/10' : 'bg-[#DC2626]/10'}`}>
                  {tx.direction === 'in' ? <ArrowUp size={15} color="#16A34A" /> : <ArrowDown size={15} color="#DC2626" />}
                </div>
                <div className="flex-1">
                  <p className="text-[#1C1C1C]" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{tx.type}</p>
                  <p className="text-[#9A9A9A]" style={{ fontSize: '0.72rem' }}>{tx.date}</p>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: tx.direction === 'in' ? '#16A34A' : '#DC2626' }}>
                  {tx.direction === 'in' ? '+' : '-'}{tx.amount}ج
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
