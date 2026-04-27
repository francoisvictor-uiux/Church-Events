import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Settings, Edit2, Phone, Heart, MessageCircle, LogOut, ChevronLeft, Star, Flame, BarChart2, FolderOpen, CheckCircle2, XCircle, HeartHandshake, X, Send, Lock, Eye } from 'lucide-react';
import { currentUser, attendanceHistory, pastoralRequests as initialRequests, PastoralRequest } from '../../data/mockData';

const PASTORAL_TYPES: { type: PastoralRequest['type']; icon: React.ReactNode; color: string; bg: string }[] = [
  { type: 'دعم نفسي',  icon: <Heart size={18} />,          color: '#DC2626', bg: '#DC262615' },
  { type: 'طلب زيارة', icon: <Phone size={18} />,          color: '#014761', bg: '#01476115' },
  { type: 'مقترح',     icon: <MessageCircle size={18} />,   color: '#00C271', bg: '#00C27115' },
  { type: 'شكوى',      icon: <Settings size={18} />,        color: '#D97706', bg: '#D9780615' },
];

export function ProfileScreen() {
  const navigate = useNavigate();
  const user = currentUser.makhdom;
  const [requests, setRequests] = useState<PastoralRequest[]>([...initialRequests]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedType, setSelectedType] = useState<PastoralRequest['type'] | ''>('');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestPrivacy, setRequestPrivacy] = useState<'سري' | 'عادي'>('سري');

  const submitRequest = () => {
    if (!selectedType || !requestDesc.trim()) return;
    setRequests(prev => [{
      id: `pr${Date.now()}`, type: selectedType as PastoralRequest['type'],
      description: requestDesc.trim(), privacy: requestPrivacy, status: 'pending', date: 'الآن',
    }, ...prev]);
    setShowRequestForm(false);
    setRequestDesc('');
    setSelectedType('');
  };

  const attendanceRate = Math.round((user.totalAttendance / user.totalMeetings) * 100);
  const monthRate = Math.round((user.monthAttendance / user.monthMeetings) * 100);

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-8 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.25)' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white" style={{ fontSize: '1.3rem', fontWeight: 700 }}>حسابي</h1>
          <button className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <Edit2 size={18} color="white" />
          </button>
        </div>

        {/* Avatar & Info */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-white/25 border-4 border-white/40 flex items-center justify-center"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            <span className="text-white" style={{ fontSize: '2rem', fontWeight: 700 }}>{user.avatar}</span>
          </div>
          <div>
            <h2 className="text-white" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user.name}</h2>
            <p className="text-white/75" style={{ fontSize: '0.82rem' }}>مخدوم</p>
            <div className="flex items-center justify-center gap-1.5 mt-1 text-white/60">
              <Phone size={12} color="rgba(255,255,255,0.6)" />
              <p style={{ fontSize: '0.78rem' }}>{user.phone}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/20 px-4 py-2 rounded-2xl text-center">
              <p className="text-white" style={{ fontSize: '1rem', fontWeight: 700 }}>{user.points}</p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-white/70" style={{ fontSize: '0.68rem' }}>نقطة</p>
                <Star size={10} color="#FBBF24" fill="#FBBF24" />
              </div>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-2xl text-center">
              <p className="text-white" style={{ fontSize: '1rem', fontWeight: 700 }}>#{user.rank}</p>
              <p className="text-white/70" style={{ fontSize: '0.68rem' }}>ترتيبي</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame size={14} color="#FF6B35" fill="#FF6B35" />
                <p className="text-white" style={{ fontSize: '1rem', fontWeight: 700 }}>{user.streak}</p>
              </div>
              <p className="text-white/70" style={{ fontSize: '0.68rem' }}>أسابيع</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Stats */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>إحصائياتي</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B6B]" style={{ fontSize: '0.85rem' }}>الحضور هذا الشهر</span>
              <div className="flex items-center gap-2">
                <span className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  {user.monthAttendance}/{user.monthMeetings}
                </span>
                <div className="flex items-center gap-1 text-[#16A34A]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                  <span>{monthRate}%</span>
                  <CheckCircle2 size={12} color="#16A34A" />
                </div>
              </div>
            </div>
            <div className="h-1.5 bg-[#C8EDE5] rounded-full overflow-hidden">
              <div className="h-full bg-[#014761] rounded-full" style={{ width: `${monthRate}%` }} />
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-[#6B6B6B]" style={{ fontSize: '0.85rem' }}>الحضور الإجمالي</span>
              <span className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.totalAttendance}/{user.totalMeetings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B6B]" style={{ fontSize: '0.85rem' }}>أطول Streak</span>
              <div className="flex items-center gap-1">
                <Flame size={13} color="#014761" fill="#014761" />
                <span className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.longestStreak} أسابيع</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B6B]" style={{ fontSize: '0.85rem' }}>القيمة المادية</span>
              <span className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.monetaryValue} جنيه</span>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen size={16} color="#014761" />
              <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>سجل الحضور</h3>
            </div>
            <button className="text-[#014761] flex items-center gap-1" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              الكل <ChevronLeft size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {attendanceHistory.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#C8EDE5] last:border-0">
                {item.attended
                  ? <CheckCircle2 size={16} color="#16A34A" />
                  : <XCircle size={16} color="#DC2626" />
                }
                <span className="flex-1 text-[#3D3D3D]" style={{ fontSize: '0.82rem' }}>{item.date}</span>
                {item.attended && (
                  <span className="text-[#16A34A]" style={{ fontSize: '0.72rem', fontWeight: 600 }}>+10 نقاط</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pastoral Services */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HeartHandshake size={16} color="#014761" />
              <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>الخدمات الرعوية</h3>
            </div>
            <button onClick={() => setShowRequestForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#014761] text-white"
              style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              + طلب جديد
            </button>
          </div>

          {/* Quick-type buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PASTORAL_TYPES.map(({ type, icon, color, bg }) => (
              <button key={type} onClick={() => { setSelectedType(type); setShowRequestForm(true); }}
                className="flex items-center gap-2 p-3 rounded-2xl border"
                style={{ fontSize: '0.82rem', background: bg, borderColor: `${color}25`, color }}>
                {icon}
                <span style={{ fontWeight: 600 }}>{type}</span>
              </button>
            ))}
          </div>

          {/* Previous requests */}
          {requests.length > 0 && (
            <div>
              <p className="text-[#9A9A9A] mb-2" style={{ fontSize: '0.73rem', fontWeight: 600 }}>طلباتي السابقة</p>
              <div className="flex flex-col gap-2">
                {requests.map(req => (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9F9F9]">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[#1C1C1C]" style={{ fontSize: '0.82rem', fontWeight: 700 }}>{req.type}</span>
                        {req.privacy === 'سري' && <Lock size={10} color="#9A9A9A" />}
                      </div>
                      <p className="text-[#7A7A7A]" style={{ fontSize: '0.75rem' }}>{req.description}</p>
                      <p className="text-[#C4C4C4] mt-1" style={{ fontSize: '0.68rem' }}>{req.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg shrink-0 ${req.status === 'closed' ? 'bg-[#16A34A]/10 text-[#16A34A]' : req.status === 'seen' ? 'bg-[#014761]/10 text-[#014761]' : 'bg-[#9A9A9A]/10 text-[#9A9A9A]'}`}
                      style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                      {req.status === 'closed' ? 'مغلق' : req.status === 'seen' ? 'شوهد' : 'بانتظار'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Request Form Sheet */}
        {showRequestForm && (
          <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.45)' }}>
            <div className="w-full bg-white rounded-t-[2rem] p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>طلب رعوي جديد</h2>
                <button onClick={() => setShowRequestForm(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <X size={16} color="#4A4A4A" />
                </button>
              </div>

              {/* Type selection */}
              <div className="mb-4">
                <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>نوع الطلب</label>
                <div className="grid grid-cols-2 gap-2">
                  {PASTORAL_TYPES.map(({ type, icon, color, bg }) => (
                    <button key={type} onClick={() => setSelectedType(type)}
                      className="flex items-center gap-2 p-3 rounded-2xl border-2 transition-all"
                      style={{
                        fontSize: '0.85rem', fontWeight: selectedType === type ? 700 : 500,
                        background: selectedType === type ? color : '#F9F9F9',
                        borderColor: selectedType === type ? color : '#E8DDD4',
                        color: selectedType === type ? 'white' : '#3D3D3D',
                      }}>
                      {icon}<span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>اشرح طلبك</label>
                <textarea value={requestDesc} onChange={e => setRequestDesc(e.target.value)} rows={4}
                  placeholder="اكتب تفاصيل طلبك هنا..."
                  className="w-full bg-[#F2F3F2] rounded-2xl p-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4] resize-none"
                  style={{ fontSize: '0.88rem' }} />
              </div>

              {/* Privacy */}
              <div className="mb-5">
                <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>الخصوصية</label>
                <div className="flex gap-3">
                  {([['سري', <Lock size={14} />, 'الخادم فقط'], ['عادي', <Eye size={14} />, 'عادي']] as const).map(([val, icon, label]) => (
                    <button key={val} onClick={() => setRequestPrivacy(val as 'سري' | 'عادي')}
                      className={`flex-1 py-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all ${requestPrivacy === val ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                      style={{ fontSize: '0.83rem', fontWeight: requestPrivacy === val ? 700 : 400 }}>
                      {icon}{label}
                    </button>
                  ))}
                </div>
                {requestPrivacy === 'سري' && (
                  <p className="text-[#9A9A9A] mt-1.5" style={{ fontSize: '0.72rem' }}>سيراه المسؤول فقط ولن يُشارك مع أحد</p>
                )}
              </div>

              <button onClick={submitRequest} disabled={!selectedType || !requestDesc.trim()}
                className="w-full py-4 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
                <Send size={16} />إرسال الطلب
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Settings size={16} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>الإعدادات</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[#3D3D3D]" style={{ fontSize: '0.88rem' }}>الإشعارات</span>
              <div className="w-12 h-6 bg-[#014761] rounded-full flex items-center px-0.5">
                <div className="w-5 h-5 bg-white rounded-full mr-auto" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#3D3D3D]" style={{ fontSize: '0.88rem' }}>اللغة</span>
              <span className="text-[#014761]" style={{ fontSize: '0.82rem', fontWeight: 600 }}>العربية</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl border-2 border-red-200 flex items-center justify-center gap-2 text-red-500"
          style={{ fontSize: '0.9rem', fontWeight: 600 }}
        >
          <LogOut size={16} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}