import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, CheckSquare, MessageSquare, PlusCircle, ClipboardList, Play, AlertTriangle, ChevronLeft, Hand, Calendar, Headphones, Image, Mic, FileText, X, Send, Users, User } from 'lucide-react';
import { currentUser, members, events, notifications } from '../../data/mockData';

export function KhademHomeScreen() {
  const navigate = useNavigate();
  const user = currentUser.khadem;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const warningMembers = members.filter((m) => m.status === 'warning');
  const nextEvent = events.find((e) => e.status === 'upcoming');
  const [showMsgSheet, setShowMsgSheet] = useState(false);
  const [msgTarget, setMsgTarget] = useState<'الكل' | string>('الكل');
  const [msgText, setMsgText] = useState('');
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [uploadType, setUploadType] = useState<'صور' | 'ملخص نصي' | 'صوت'>('صور');
  const [uploadedItems, setUploadedItems] = useState<{ type: string; name: string }[]>([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء النور';
  };

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.25)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/80" style={{ fontSize: '0.82rem' }}>{getGreeting()}</p>
            <div className="flex items-center gap-2">
              <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user.name}</h1>
              <Hand size={20} color="white" />
            </div>
            <p className="text-white/70" style={{ fontSize: '0.78rem' }}>خادمة</p>
          </div>
          <button
            onClick={() => navigate('/khadem/notifications')}
            className="relative w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center"
          >
            <Bell size={20} color="white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#014761]"
                style={{ fontSize: '0.65rem', fontWeight: 700 }}>{unreadCount}</span>
            )}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: user.presentFriday, label: 'حضروا الجمعة', color: 'bg-white/20' },
            { value: user.absentFriday, label: 'غابوا', color: 'bg-white/20' },
            { value: user.newTasks, label: 'مهام جديدة', color: 'bg-white/20' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-3 text-center`}>
              <p className="text-white" style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{stat.value}</p>
              <p className="text-white/70 mt-1" style={{ fontSize: '0.65rem' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Warning Members */}
        {warningMembers.length > 0 && (
          <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} color="#00C271" />
              <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>يحتاجون متابعة</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#00C271]/15 text-[#0F2030]" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                {warningMembers.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {warningMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F2F3F2]">
                  <div className="w-9 h-9 rounded-full bg-[#00C271]/20 flex items-center justify-center">
                    <span className="text-[#0F2030]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1C1C1C]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{member.name}</p>
                    <p className="text-[#9A9A9A]" style={{ fontSize: '0.72rem' }}>غاب {member.daysAbsent} يوم</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-[#014761] text-white" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                    تواصل
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <h3 className="text-[#1C1C1C] mb-3" style={{ fontSize: '0.9rem', fontWeight: 700 }}>إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <CheckSquare size={18} color="#014761" />, label: 'سجّل حضور', action: () => navigate('/khadem/attendance') },
              { icon: <MessageSquare size={18} color="#014761" />, label: 'رسالة جماعية', action: () => {} },
              { icon: <ClipboardList size={18} color="#014761" />, label: 'مهمة جديدة', action: () => navigate('/khadem/tasks') },
              { icon: <PlusCircle size={18} color="#014761" />, label: 'إضافة نقاط', action: () => navigate('/khadem/members') },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#F2F3F2] border border-[#A8DFD0]"
                style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1C1C1C' }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Next Event */}
        {nextEvent && (
          <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} color="#014761" />
              <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>الحدث القادم</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#014761]/10 flex items-center justify-center">
                <Calendar size={22} color="#014761" />
              </div>
              <div className="flex-1">
                <p className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{nextEvent.title}</p>
                <p className="text-[#7A7A7A]" style={{ fontSize: '0.75rem' }}>{nextEvent.date}</p>
              </div>
              <div className="text-left">
                <p className="text-[#014761]" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{nextEvent.committed}</p>
                <p className="text-[#9A9A9A]" style={{ fontSize: '0.68rem' }}>ملتزم</p>
              </div>
            </div>
          </div>
        )}

        {/* Audio Summary */}
        <div className="bg-gradient-to-r from-[#0F2030] to-[#014761] rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-white/80 mb-1">
                <Headphones size={13} color="rgba(255,255,255,0.8)" />
                <p style={{ fontSize: '0.75rem' }}>آخر ملخص</p>
              </div>
              <p className="text-white" style={{ fontSize: '0.9rem', fontWeight: 700 }}>ملخص الخدمة هذا الأسبوع</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Play size={20} color="white" fill="white" />
            </div>
          </div>
        </div>

        {/* Individual Messages */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={15} color="#014761" />
              <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>رسائل</h3>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setMsgTarget('الكل'); setShowMsgSheet(true); }}
              className="flex-1 py-3 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
              style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              <Users size={15} />رسالة جماعية
            </button>
            <button onClick={() => { setMsgTarget(''); setShowMsgSheet(true); }}
              className="flex-1 py-3 rounded-2xl border border-[#A8DFD0] text-[#3D3D3D] flex items-center justify-center gap-2"
              style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              <User size={15} />رسالة فردية
            </button>
          </div>
        </div>

        {/* Content Upload */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Image size={15} color="#014761" />
              <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>رفع محتوى</h3>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            {(['صور', 'ملخص نصي', 'صوت'] as const).map(t => (
              <button key={t} onClick={() => { setUploadType(t); setShowUploadSheet(true); }}
                className="flex-1 py-2.5 rounded-xl border border-[#A8DFD0] bg-[#F9F9F9] flex flex-col items-center gap-1"
                style={{ fontSize: '0.73rem', color: '#3D3D3D' }}>
                {t === 'صور' ? <Image size={16} color="#014761" /> : t === 'صوت' ? <Mic size={16} color="#014761" /> : <FileText size={16} color="#014761" />}
                {t}
              </button>
            ))}
          </div>
          {uploadedItems.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {uploadedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#F2F3F2] rounded-xl px-3 py-2">
                  {item.type === 'صور' ? <Image size={13} color="#014761" /> : item.type === 'صوت' ? <Mic size={13} color="#014761" /> : <FileText size={13} color="#014761" />}
                  <span className="flex-1 text-[#3D3D3D]" style={{ fontSize: '0.78rem' }}>{item.name}</span>
                  <button onClick={() => setUploadedItems(prev => prev.filter((_, j) => j !== i))}>
                    <X size={12} color="#9A9A9A" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members Preview */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>مخدوميني ({members.length})</h3>
            <button onClick={() => navigate('/khadem/members')} className="text-[#014761] flex items-center gap-1" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              الكل <ChevronLeft size={12} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {members.slice(0, 6).map((member) => (
              <div key={member.id} className="flex flex-col items-center gap-1 shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${member.status === 'warning' ? 'bg-[#00C271]/25' : 'bg-[#014761]/15'}`}>
                  <span className={`${member.status === 'warning' ? 'text-[#0F2030]' : 'text-[#014761]'}`} style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {member.avatar}
                  </span>
                </div>
                <span className="text-[#4A4A4A]" style={{ fontSize: '0.65rem' }}>{member.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Sheet */}
      {showMsgSheet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full bg-white rounded-t-[2rem] p-6 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                {msgTarget === 'الكل' ? 'رسالة جماعية' : 'رسالة فردية'}
              </h2>
              <button onClick={() => setShowMsgSheet(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X size={16} color="#4A4A4A" />
              </button>
            </div>

            {msgTarget !== 'الكل' && (
              <div className="mb-4">
                <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>إرسال إلى</label>
                <select value={msgTarget} onChange={e => setMsgTarget(e.target.value)}
                  className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C]" style={{ fontSize: '0.88rem' }}>
                  <option value="">اختر مخدوم</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {msgTarget === 'الكل' ? 'رسالة للجميع' : 'نص الرسالة'}
              </label>
              <textarea value={msgText} onChange={e => setMsgText(e.target.value)} rows={4}
                placeholder="اكتب رسالتك هنا..."
                className="w-full bg-[#F2F3F2] rounded-2xl p-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4] resize-none"
                style={{ fontSize: '0.88rem' }} />
            </div>

            <button onClick={() => { setShowMsgSheet(false); setMsgText(''); }}
              disabled={!msgText.trim() || (msgTarget !== 'الكل' && !msgTarget)}
              className="w-full py-4 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
              <Send size={16} />إرسال الرسالة
            </button>
          </div>
        </div>
      )}

      {/* Upload Sheet */}
      {showUploadSheet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full bg-white rounded-t-[2rem] p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>رفع {uploadType}</h2>
              <button onClick={() => setShowUploadSheet(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X size={16} color="#4A4A4A" />
              </button>
            </div>

            {uploadType === 'صور' && (
              <div>
                <p className="text-[#9A9A9A] mb-3" style={{ fontSize: '0.82rem' }}>ارفع صور لمشاركتها مع الخدمة</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-20 h-20 rounded-2xl bg-[#F2F3F2] border-2 border-dashed border-[#A8DFD0] flex flex-col items-center justify-center gap-1">
                      <Image size={18} color="#C4C4C4" />
                      <span className="text-[#C4C4C4]" style={{ fontSize: '0.6rem' }}>إضافة</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadType === 'ملخص نصي' && (
              <div>
                <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>ملخص الاجتماع</label>
                <textarea rows={5} placeholder="اكتب ملخص الاجتماع أو الحدث هنا..."
                  className="w-full bg-[#F2F3F2] rounded-2xl p-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4] resize-none mb-3"
                  style={{ fontSize: '0.88rem' }} />
              </div>
            )}

            {uploadType === 'صوت' && (
              <div>
                <p className="text-[#9A9A9A] mb-3" style={{ fontSize: '0.82rem' }}>ارفع تسجيل صوتي أو ملخص بودكاست</p>
                <button className="w-full py-4 rounded-2xl border-2 border-dashed border-[#A8DFD0] flex items-center justify-center gap-2 text-[#7A7A7A] mb-3"
                  style={{ fontSize: '0.85rem' }}>
                  <Mic size={18} />اضغط للتسجيل أو رفع ملف MP3
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setUploadedItems(prev => [...prev, { type: uploadType, name: `${uploadType}_${Date.now()}.${uploadType === 'صوت' ? 'mp3' : uploadType === 'صور' ? 'jpg' : 'txt'}` }]);
                setShowUploadSheet(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
              style={{ fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
              رفع {uploadType}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}