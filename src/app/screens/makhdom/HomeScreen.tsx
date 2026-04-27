import { useNavigate } from 'react-router';
import { Bell, QrCode, Trophy, CheckSquare, ChevronLeft, Play, Flame, Calendar, Clock, MapPin, Star, Bus, Headphones, Hand, BookOpen, Megaphone, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { currentUser, events, tasks, notifications, homeContent } from '../../data/mockData';

export function MakhdomHomeScreen() {
  const navigate = useNavigate();
  const user = currentUser.makhdom;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const newTasks = tasks.filter((t) => t.status === 'new').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء النور';
  };

  const nextEvent = events.find((e) => e.status === 'upcoming');
  const maxPoints = 300;
  const progressPercent = (user.points / maxPoints) * 100;

  const EventTypeIcon = ({ type }: { type: string }) => {
    if (type === 'رحلة') return <Bus size={18} color="#014761" />;
    return <Calendar size={18} color="#014761" />;
  };

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.25)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/80" style={{ fontSize: '0.82rem' }}>{getGreeting()}</p>
            <div className="flex items-center gap-2">
              <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                {user.name}
              </h1>
              <Hand size={20} color="white" />
            </div>
          </div>
          <button
            onClick={() => navigate('/makhdom/notifications')}
            className="relative w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center"
          >
            <Bell size={20} color="white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F2F3F2] flex items-center justify-center text-[#014761]" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Level Progress */}
        <div className="bg-white/15 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5 text-white/90" style={{ fontSize: '0.82rem' }}>
              <span>مستوى {user.level}</span>
              <Star size={13} color="#FBBF24" fill="#FBBF24" />
            </div>
            <span className="text-white" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {user.points} / {maxPoints} نقطة
            </span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <p className="text-white/70 mt-2" style={{ fontSize: '0.75rem' }}>
            {maxPoints - user.points} نقطة للمستوى التالي "قائد"
          </p>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-5">
        {/* Upcoming Event Card */}
        {nextEvent && (
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.08)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-lg bg-[#014761]/10 text-[#014761]" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                    {nextEvent.type}
                  </span>
                  <span className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>قادم</span>
                </div>
                <h3 className="text-[#1C1C1C]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  {nextEvent.title}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#F2F3F2] flex items-center justify-center">
                <Calendar size={20} color="#014761" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={13} color="#00C271" />
                <span className="text-[#4A4A4A]" style={{ fontSize: '0.82rem' }}>{nextEvent.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} color="#00C271" />
                <span className="text-[#4A4A4A]" style={{ fontSize: '0.82rem' }}>{nextEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} color="#00C271" />
                <span className="text-[#4A4A4A]" style={{ fontSize: '0.82rem' }}>{nextEvent.location}</span>
              </div>
            </div>

            {/* Show QR Button */}
            <button
              onClick={() => navigate('/makhdom/qr')}
              className="w-full py-3.5 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
              style={{ fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}
            >
              <QrCode size={18} />
              <span>أظهر بطاقتي</span>
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/makhdom/points')}
            className="flex-1 bg-white rounded-3xl p-4 flex flex-col gap-2"
            style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.08)' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#00C271]/15 flex items-center justify-center">
              <Trophy size={18} color="#00C271" />
            </div>
            <div>
              <p className="text-[#1C1C1C]" style={{ fontSize: '1rem', fontWeight: 700 }}>#{user.rank}</p>
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>في الخدمة</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/makhdom/tasks')}
            className="flex-1 bg-white rounded-3xl p-4 flex flex-col gap-2"
            style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.08)' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#014761]/10 flex items-center justify-center">
              <CheckSquare size={18} color="#014761" />
            </div>
            <div>
              <p className="text-[#1C1C1C]" style={{ fontSize: '1rem', fontWeight: 700 }}>{newTasks} مهام</p>
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>جديدة</p>
            </div>
          </button>

          <div className="flex-1 bg-white rounded-3xl p-4 flex flex-col gap-2" style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.08)' }}>
            <div className="w-10 h-10 rounded-2xl bg-[#E8FFF5] flex items-center justify-center">
              <Flame size={18} color="#014761" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Flame size={14} color="#014761" fill="#014761" />
                <p className="text-[#1C1C1C]" style={{ fontSize: '1rem', fontWeight: 700 }}>{user.streak}</p>
              </div>
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>أسابيع Streak</p>
            </div>
          </div>
        </div>

        {/* Daily Verse */}
        <div className="bg-gradient-to-br from-[#014761] to-[#005C5C] rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} color="rgba(255,255,255,0.7)" />
            <span className="text-white/70" style={{ fontSize: '0.73rem' }}>آية اليوم</span>
          </div>
          <p className="text-white leading-relaxed mb-3" style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.8 }}>
            "{homeContent.verse.text}"
          </p>
          <p className="text-white/60" style={{ fontSize: '0.78rem', fontWeight: 700 }}>{homeContent.verse.reference}</p>
        </div>

        {/* Weekly Topic */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.08)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-[#014761]/10 flex items-center justify-center">
              <BookOpen size={14} color="#014761" />
            </div>
            <span className="text-[#9A9A9A]" style={{ fontSize: '0.72rem' }}>موضوع الأسبوع</span>
          </div>
          <p className="text-[#1C1C1C] mb-2" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{homeContent.topic.title}</p>
          <p className="text-[#6B6B6B]" style={{ fontSize: '0.82rem', lineHeight: 1.7 }}>{homeContent.topic.body}</p>
        </div>

        {/* Announcements */}
        {homeContent.announcements.length > 0 && (
          <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Megaphone size={15} color="#014761" />
                <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>إعلانات وفرص</h3>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {homeContent.announcements.map(ann => (
                <div key={ann.id} className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9F9F9]">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${ann.type === 'job' ? 'bg-[#7C3AED]/10' : ann.type === 'news' ? 'bg-[#00C271]/10' : 'bg-[#014761]/10'}`}>
                    {ann.type === 'job' ? <Briefcase size={14} color="#7C3AED" /> : <Megaphone size={14} color="#014761" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1C1C1C]" style={{ fontSize: '0.83rem', fontWeight: 700 }}>{ann.title}</p>
                    <p className="text-[#7A7A7A] mt-0.5" style={{ fontSize: '0.75rem' }}>{ann.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>أحداث أخرى قادمة</h3>
            <button
              onClick={() => navigate('/makhdom/events')}
              className="flex items-center gap-1 text-[#014761]"
              style={{ fontSize: '0.78rem', fontWeight: 600 }}
            >
              <span>الكل</span>
              <ChevronLeft size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {events.filter((e) => e.status === 'upcoming').slice(1).map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/makhdom/events/${event.id}`)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#F2F3F2]"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#014761]/10 flex items-center justify-center shrink-0">
                  <EventTypeIcon type={event.type} />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[#1C1C1C]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{event.title}</p>
                  <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>{event.date}</p>
                </div>
                <ChevronLeft size={16} color="#C4C4C4" />
              </button>
            ))}
          </div>
        </div>

        {/* Audio Summary */}
        <div className="bg-gradient-to-r from-[#014761] to-[#00C271] rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-white/80 mb-1">
                <Headphones size={13} color="rgba(255,255,255,0.8)" />
                <p style={{ fontSize: '0.75rem' }}>ملخص الأسبوع</p>
              </div>
              <p className="text-white" style={{ fontSize: '0.9rem', fontWeight: 700 }}>استمع لملخص هذا الأسبوع</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Play size={20} color="white" fill="white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full">
              <div className="h-full w-1/3 bg-white rounded-full" />
            </div>
            <span className="text-white/80" style={{ fontSize: '0.72rem' }}>3:24</span>
          </div>
        </div>
      </div>
    </div>
  );
}