import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronRight, Search, ChevronLeft, MapPin, Clock, Users, DollarSign, Lock, Check, X, Share2, CheckCircle2, XCircle, Hand, Bus, Handshake, Calendar, ClipboardList, HelpCircle, Church, CheckSquare, HeartHandshake, BookOpen, Target, BarChart2, Plus, Play, Pause, Headphones, Image, Bell, FileText } from 'lucide-react';
import { events, tasks } from '../../data/mockData';

type Tab = 'الكل' | 'قادمة' | 'سابقة';

export function EventsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('الكل');
  const navigate = useNavigate();

  const filtered = events.filter((e) => {
    if (activeTab === 'قادمة') return e.status === 'upcoming';
    if (activeTab === 'سابقة') return e.status === 'past';
    return true;
  });

  const EventTypeIcon = ({ type, size = 16 }: { type: string; size?: number }) => {
    if (type === 'رحلة') return <Bus size={size} color="#014761" />;
    if (type === 'خدمة') return <Handshake size={size} color="#014761" />;
    return <Calendar size={size} color="#014761" />;
  };

  const getStatusBadge = (event: typeof events[0]) => {
    if (event.status === 'past') {
      return event.myStatus === 'committed'
        ? (
          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ fontSize: '0.68rem' }}>
            <CheckCircle2 size={10} />حضرت
          </span>
        )
        : (
          <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ fontSize: '0.68rem' }}>
            <XCircle size={10} />غبت
          </span>
        );
    }
    if (event.registrationStatus === 'محجوز') {
      return <span className="text-[#0F2030] bg-[#00C271]/20 px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ fontSize: '0.68rem' }}><Lock size={10} />محجوز</span>;
    }
    if (event.myStatus === 'committed') {
      return (
        <span className="text-[#014761] bg-[#014761]/10 px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ fontSize: '0.68rem' }}>
          <Hand size={10} />ملتزم
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-5 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white" style={{ fontSize: '1.3rem', fontWeight: 700 }}>الأحداث</h1>
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <Search size={18} color="white" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['الكل', 'قادمة', 'سابقة'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl transition-all ${
                activeTab === tab
                  ? 'bg-white text-[#014761]'
                  : 'bg-white/15 text-white'
              }`}
              style={{ fontSize: '0.82rem', fontWeight: activeTab === tab ? 700 : 500 }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {filtered.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl p-5"
            style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-lg bg-[#014761]/10 text-[#014761]" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                  {event.type}
                </span>
                {getStatusBadge(event)}
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#F2F3F2] flex items-center justify-center">
                <EventTypeIcon type={event.type} />
              </div>
            </div>

            <h3 className="text-[#1C1C1C] mb-3" style={{ fontSize: '1rem', fontWeight: 700 }}>
              {event.title}
            </h3>

            <div className="flex flex-col gap-1.5 mb-4">
              <div className="flex items-center gap-2">
                <Clock size={13} color="#00C271" />
                <span className="text-[#4A4A4A]" style={{ fontSize: '0.8rem' }}>{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} color="#00C271" />
                <span className="text-[#4A4A4A]" style={{ fontSize: '0.8rem' }}>{event.location}</span>
              </div>
              {event.paid && (
                <div className="flex items-center gap-2">
                  <DollarSign size={13} color="#00C271" />
                  <span className="text-[#4A4A4A]" style={{ fontSize: '0.8rem' }}>{event.price} جنيه</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users size={13} color="#00C271" />
                <span className="text-[#4A4A4A]" style={{ fontSize: '0.8rem' }}>{event.committed} سيحضر</span>
              </div>
            </div>

            <div className="flex gap-2">
              {event.status === 'upcoming' && event.myStatus !== 'committed' && (
                <button className="flex-1 py-3 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-1.5"
                  style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  <Check size={14} />
                  أنا هحضر
                </button>
              )}
              <button
                onClick={() => navigate(`/makhdom/events/${event.id}`)}
                className={`${event.status === 'upcoming' && event.myStatus !== 'committed' ? '' : 'flex-1'} py-3 px-4 rounded-2xl border border-[#A8DFD0] flex items-center justify-center gap-1.5 text-[#4A4A4A]`}
                style={{ fontSize: '0.82rem', fontWeight: 600 }}
              >
                تفاصيل
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TaskTypeIcon = ({ type, size = 14 }: { type: string; size?: number }) => {
  if (type === 'روحية') return <HeartHandshake size={size} color="#014761" />;
  if (type === 'قراءة') return <BookOpen size={size} color="#014761" />;
  if (type === 'مسابقة') return <Target size={size} color="#014761" />;
  if (type === 'استبيان') return <BarChart2 size={size} color="#014761" />;
  return <CheckSquare size={size} color="#014761" />;
};

type DetailTab = 'عام' | 'البرنامج' | 'محتوى' | 'مهام';

export function EventDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find((e) => e.id === id) || events[0];
  const [myStatus, setMyStatus] = useState(event.myStatus);
  const [activeTab, setActiveTab] = useState<DetailTab>('عام');
  const [activePhoto, setActivePhoto] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const eventTasks = tasks.filter((t) => t.eventId === event.id);

  const TABS: { key: DetailTab; label: string; count?: number }[] = [
    { key: 'عام',      label: 'عام' },
    { key: 'البرنامج', label: 'البرنامج', count: event.program.length || undefined },
    { key: 'محتوى',   label: 'محتوى' },
    { key: 'مهام',    label: 'مهام', count: eventTasks.length || undefined },
  ];

  const EventHeaderIcon = ({ type }: { type: string }) => {
    if (type === 'رحلة') return <Bus size={36} color="rgba(255,255,255,0.7)" />;
    return <Church size={36} color="rgba(255,255,255,0.7)" />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Fixed Header ── */}
      <div className="bg-[#014761] px-5 pt-14 pb-0 shrink-0" style={{ boxShadow: '0 4px 20px rgba(1, 71, 97, 0.25)' }}>
        {/* Nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <ChevronRight size={20} color="white" />
          </button>
          <button className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <Share2 size={18} color="white" />
          </button>
        </div>

        {/* Event identity */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <EventHeaderIcon type={event.type} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-lg bg-white/20 text-white/90" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                {event.type}
              </span>
              {event.paid && (
                <span className="px-2 py-0.5 rounded-lg bg-[#FBBF24]/20 text-[#FBBF24]" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                  {event.price} جنيه
                </span>
              )}
            </div>
            <h1 className="text-white" style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.3 }}>{event.title}</h1>
            <p className="text-white/70 mt-0.5" style={{ fontSize: '0.75rem' }}>{event.date} • {event.time}</p>
          </div>
        </div>

        {/* Tab Bar — inside header */}
        <div className="flex gap-1 pb-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 transition-all"
              style={{
                fontSize: '0.82rem',
                fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.5)',
                borderBottom: activeTab === tab.key ? '2px solid white' : '2px solid transparent',
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className="rounded-full px-1.5 py-0.5"
                  style={{
                    fontSize: '0.62rem', fontWeight: 700,
                    background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                    color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable Tab Content ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="px-5 pt-5 pb-8 flex flex-col gap-4">

          {/* ─ TAB: عام ─ */}
          {activeTab === 'عام' && (
            <>
              {/* Info row */}
              <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: <MapPin size={15} color="#014761" />, text: event.location },
                    { icon: <DollarSign size={15} color="#014761" />, text: event.paid ? `${event.price} جنيه` : 'مجاني' },
                    { icon: <Users size={15} color="#014761" />, text: `${event.committed} سيحضر` },
                    { icon: <Clock size={15} color="#014761" />, text: event.time },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#014761]/10 flex items-center justify-center shrink-0">
                        {row.icon}
                      </div>
                      <span className="text-[#3D3D3D]" style={{ fontSize: '0.88rem' }}>{row.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
                <h3 className="text-[#1C1C1C] mb-2" style={{ fontSize: '0.95rem', fontWeight: 700 }}>عن الحدث</h3>
                <p className="text-[#6B6B6B]" style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>{event.description}</p>
              </div>

              {/* Alerts */}
              {event.alerts && event.alerts.length > 0 && (
                <div className="bg-[#FFF8E6] rounded-3xl p-4 border border-[#FBBF24]/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell size={14} color="#D97706" />
                    <h3 className="text-[#92400E]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>تنبيهات الحدث</h3>
                  </div>
                  {event.alerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-2 shrink-0" />
                      <span className="text-[#92400E]" style={{ fontSize: '0.83rem' }}>{alert}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Commitment */}
              {event.status === 'upcoming' && (
                <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>حالة مشاركتك</h3>
                    {myStatus === 'committed'
                      ? <span className="flex items-center gap-1 text-[#16A34A]" style={{ fontSize: '0.75rem' }}><CheckCircle2 size={13} color="#16A34A" />ملتزم</span>
                      : <span className="flex items-center gap-1 text-[#7A7A7A]" style={{ fontSize: '0.75rem' }}><HelpCircle size={13} color="#7A7A7A" />لم تحدد</span>
                    }
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setMyStatus('committed')}
                      className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${myStatus === 'committed' ? 'bg-[#014761] text-white' : 'border border-[#A8DFD0] text-[#4A4A4A]'}`}
                      style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      <Check size={15} />أنا هحضر
                    </button>
                    <button onClick={() => setMyStatus('absent')}
                      className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${myStatus === 'absent' ? 'bg-red-500 text-white' : 'border border-[#E8DDD4] text-[#4A4A4A]'}`}
                      style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      <X size={15} />لن أحضر
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─ TAB: البرنامج ─ */}
          {activeTab === 'البرنامج' && (
            <>
              {event.program.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {event.program.map((item, i) => (
                    <div key={i} className="bg-white rounded-3xl p-4 flex gap-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-[#014761] flex items-center justify-center">
                          <span className="text-white" style={{ fontSize: '0.72rem', fontWeight: 700 }}>{item.time || String(i + 1)}</span>
                        </div>
                        {i < event.program.length - 1 && (
                          <div className="w-0.5 flex-1 bg-[#C8EDE5] rounded-full" style={{ minHeight: 16 }} />
                        )}
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-[#1C1C1C]" style={{ fontSize: '0.92rem', fontWeight: 700 }}>{item.activity}</p>
                        {item.notes && (
                          <p className="text-[#7A7A7A] mt-1" style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>{item.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-16 text-center">
                  <ClipboardList size={40} color="#C4C4C4" />
                  <p className="text-[#9A9A9A] mt-3" style={{ fontSize: '0.88rem' }}>لا يوجد برنامج مفصّل لهذا الحدث</p>
                </div>
              )}
            </>
          )}

          {/* ─ TAB: محتوى ─ */}
          {activeTab === 'محتوى' && (
            <>
              {/* Photos */}
              {event.photos && event.photos.length > 0 ? (
                <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
                  <div className="relative h-52 bg-gradient-to-br from-[#014761] to-[#00C271] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Image size={38} color="rgba(255,255,255,0.4)" />
                      <span className="text-white/70" style={{ fontSize: '0.8rem' }}>صورة {activePhoto + 1} من {event.photos.length}</span>
                    </div>
                    {event.photos.length > 1 && (
                      <>
                        <button onClick={() => setActivePhoto(i => Math.max(0, i - 1))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 flex items-center justify-center">
                          <ChevronRight size={17} color="white" />
                        </button>
                        <button onClick={() => setActivePhoto(i => Math.min(event.photos!.length - 1, i + 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 flex items-center justify-center">
                          <ChevronLeft size={17} color="white" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 py-3">
                    {event.photos.map((_, i) => (
                      <button key={i} onClick={() => setActivePhoto(i)}
                        className={`rounded-full transition-all ${i === activePhoto ? 'w-5 h-2 bg-[#014761]' : 'w-2 h-2 bg-[#C8EDE5]'}`} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#F9F9F9] rounded-3xl flex flex-col items-center py-10 gap-2">
                  <Image size={36} color="#C4C4C4" />
                  <p className="text-[#9A9A9A]" style={{ fontSize: '0.83rem' }}>لا توجد صور لهذا الحدث</p>
                </div>
              )}

              {/* Audio */}
              {event.audioDuration ? (
                <div className="bg-gradient-to-r from-[#014761] to-[#005C5C] rounded-3xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                      <Headphones size={20} color="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white" style={{ fontSize: '0.9rem', fontWeight: 700 }}>ملخص صوتي</p>
                      <p className="text-white/60" style={{ fontSize: '0.73rem' }}>مدة: {event.audioDuration}</p>
                    </div>
                    <button onClick={() => setIsPlaying(p => !p)}
                      className="w-11 h-11 rounded-full bg-white flex items-center justify-center"
                      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                      {isPlaying
                        ? <Pause size={17} color="#014761" fill="#014761" />
                        : <Play size={17} color="#014761" fill="#014761" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '30%' }} />
                    </div>
                    <span className="text-white/60" style={{ fontSize: '0.7rem' }}>{event.audioDuration}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F9F9F9] rounded-3xl flex flex-col items-center py-10 gap-2">
                  <Headphones size={36} color="#C4C4C4" />
                  <p className="text-[#9A9A9A]" style={{ fontSize: '0.83rem' }}>لا يوجد ملخص صوتي</p>
                </div>
              )}

              {/* Text summary */}
              {event.textSummary && (
                <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={15} color="#014761" />
                    <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>ملخص نصي</h3>
                  </div>
                  <p className="text-[#6B6B6B]" style={{ fontSize: '0.85rem', lineHeight: 1.85 }}>{event.textSummary}</p>
                </div>
              )}
            </>
          )}

          {/* ─ TAB: مهام ─ */}
          {activeTab === 'مهام' && (
            <>
              {eventTasks.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {eventTasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TaskTypeIcon type={task.type} size={16} />
                          <span className="px-2 py-0.5 rounded-lg bg-[#014761]/10 text-[#014761]" style={{ fontSize: '0.67rem', fontWeight: 600 }}>
                            {task.type}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[#16A34A]" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                          <Plus size={11} strokeWidth={3} />{task.points} نقاط
                        </span>
                      </div>
                      <p className="text-[#1C1C1C] mb-1" style={{ fontSize: '0.92rem', fontWeight: 700 }}>{task.title}</p>
                      <p className="text-[#7A7A7A] mb-3" style={{ fontSize: '0.77rem' }}>الموعد: {task.deadline}</p>
                      {task.status !== 'done' ? (
                        <button onClick={() => navigate(`/makhdom/tasks/${task.id}`)}
                          className="w-full py-3 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
                          style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          تنفيذ المهمة <ChevronLeft size={14} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#16A34A]/8 rounded-2xl px-3 py-2.5">
                          <CheckCircle2 size={14} color="#16A34A" />
                          <span className="text-[#16A34A]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>تم الإنجاز ✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-16 text-center">
                  <CheckSquare size={40} color="#C4C4C4" />
                  <p className="text-[#9A9A9A] mt-3" style={{ fontSize: '0.88rem' }}>لا توجد مهام لهذا الحدث</p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}