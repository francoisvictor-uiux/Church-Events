import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Camera, Check, Send, X, User, Flame, XCircle, CheckCircle2 } from 'lucide-react';
import { members, events } from '../../data/mockData';

export function AttendanceScreen() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<Record<string, boolean | null>>(
    Object.fromEntries(members.map((m) => [m.id, null]))
  );
  const [saved, setSaved] = useState(false);
  const selectedEvent = events.find((e) => e.status === 'upcoming') || events[0];

  const toggle = (id: string) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAll = () => {
    setAttendance(Object.fromEntries(members.map((m) => [m.id, true])));
  };

  const clearAll = () => {
    setAttendance(Object.fromEntries(members.map((m) => [m.id, null])));
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = members.length - presentCount;

  const handleSave = () => {
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="flex flex-col h-full bg-[#F2F3F2]">
        {/* Header */}
        <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
            <ChevronRight size={20} color="white" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-white" style={{ fontSize: '1.1rem', fontWeight: 700 }}>تم تسجيل الحضور</h1>
            <CheckCircle2 size={18} color="white" />
          </div>
        </div>

        <div className="px-5 pt-6 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 text-center" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
            <CheckCircle2 size={56} color="#16A34A" className="mx-auto" />
            <h2 className="text-[#1C1C1C] mt-3" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              تم تسجيل حضور {presentCount} من {members.length}
            </h2>
            <p className="text-[#7A7A7A] mt-1" style={{ fontSize: '0.85rem' }}>
              {absentCount} مخدوم غائب
            </p>
          </div>

          {absentCount > 0 && (
            <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
              <h3 className="text-[#1C1C1C] mb-3" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                هل تريد إرسال تذكير للغايبين؟
              </h3>
              <div className="flex flex-col gap-2 mb-4">
                {members
                  .filter((m) => !attendance[m.id])
                  .map((m) => (
                    <div key={m.id} className="flex items-center gap-2 p-2 rounded-xl bg-[#F2F3F2]">
                      <User size={14} color="#7A7A7A" />
                      <span className="text-[#3D3D3D]" style={{ fontSize: '0.82rem' }}>{m.name}</span>
                    </div>
                  ))
                }
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
                  style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  <Send size={14} />
                  إرسال رسالة جماعية
                </button>
                <button onClick={() => navigate('/khadem/home')} className="flex-1 py-3 rounded-2xl border border-[#A8DFD0] text-[#4A4A4A]"
                  style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  لا، شكراً
                </button>
              </div>
            </div>
          )}

          {absentCount === 0 && (
            <button onClick={() => navigate('/khadem/home')} className="w-full py-4 rounded-2xl bg-[#014761] text-white"
              style={{ fontWeight: 700, fontSize: '1rem' }}>
              العودة للرئيسية
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-4 bg-[#F2F3F2]">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-5 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <ChevronRight size={20} color="white" />
          </button>
          <h1 className="text-white" style={{ fontSize: '1.1rem', fontWeight: 700 }}>تسجيل الحضور</h1>
          <button className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <Camera size={18} color="white" />
          </button>
        </div>

        <div className="bg-white/15 rounded-2xl px-4 py-2.5">
          <p className="text-white" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{selectedEvent.title}</p>
          <p className="text-white/70" style={{ fontSize: '0.75rem' }}>{selectedEvent.date}</p>
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Select Controls */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={selectAll} className="px-4 py-2 rounded-xl bg-[#014761]/10 text-[#014761]" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            اختر الكل
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[#16A34A]" style={{ fontSize: '0.82rem', fontWeight: 600 }}>حضر: {presentCount}</span>
            <span className="text-[#DC2626]" style={{ fontSize: '0.82rem', fontWeight: 600 }}>غاب: {absentCount}</span>
          </div>
          <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-[#F5F5F5] text-[#7A7A7A]" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            مسح الكل
          </button>
        </div>

        {/* Member List */}
        <div className="flex flex-col gap-2 mb-5">
          {members.map((member) => {
            const isPresent = attendance[member.id];
            return (
              <button
                key={member.id}
                onClick={() => toggle(member.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl w-full text-right transition-all ${
                  isPresent ? 'bg-[#014761]/8 border border-[#014761]/25' : 'bg-white border border-transparent'
                }`}
                style={{ boxShadow: '0 2px 8px rgba(1, 71, 97, 0.06)' }}
              >
                <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                  isPresent ? 'bg-[#014761] border-[#014761]' : 'border-[#C4C4C4] bg-white'
                }`}>
                  {isPresent && <Check size={14} color="white" strokeWidth={3} />}
                </div>
                <div className="flex-1">
                  <p className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{member.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {member.streak > 0
                      ? (
                        <div className="flex items-center gap-1">
                          <Flame size={11} color="#014761" fill="#014761" />
                          <span style={{ fontSize: '0.72rem', color: '#014761' }}>{member.streak} أسابيع</span>
                        </div>
                      )
                      : (
                        <div className="flex items-center gap-1">
                          <XCircle size={11} color="#9A9A9A" />
                          <span style={{ fontSize: '0.72rem', color: '#9A9A9A' }}>منقطع</span>
                        </div>
                      )
                    }
                    <span className="text-[#C4C4C4]">•</span>
                    <span className="text-[#C4C4C4]" style={{ fontSize: '0.72rem' }}>{member.points} نقطة</span>
                  </div>
                </div>
                {isPresent && (
                  <span className="px-2 py-0.5 rounded-lg bg-[#014761]/15 text-[#014761]" style={{ fontSize: '0.68rem', fontWeight: 600 }}>حضر</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.1)' }}>
          <div>
            <p className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              حضر: {presentCount} • غاب: {absentCount}
            </p>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-[#014761] text-white flex items-center gap-2"
            style={{ fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}
          >
            <Check size={16} />
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}
