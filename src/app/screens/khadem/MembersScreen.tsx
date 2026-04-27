import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Search, ChevronRight, ChevronLeft, Phone, MessageSquare, PlusCircle, ClipboardList, Save, AlertTriangle, Flame, XCircle, BarChart2, Star, FolderOpen, CheckCircle2 } from 'lucide-react';
import { members, Member } from '../../data/mockData';

export function MembersScreen() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = members.filter((m) =>
    m.name.includes(query) || m.phone.includes(query)
  );

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-5 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <h1 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          مخدوميني ({members.length})
        </h1>
        <div className="flex items-center gap-3 bg-white/15 rounded-2xl px-4 py-3">
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف..."
            className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none"
            style={{ fontSize: '0.88rem' }}
          />
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-3">
        {filtered.map((member) => (
          <button
            key={member.id}
            onClick={() => navigate(`/khadem/members/${member.id}`)}
            className="bg-white rounded-3xl p-4 flex items-center gap-3 w-full text-right"
            style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              member.status === 'warning' ? 'bg-[#00C271]/20' : 'bg-[#014761]/12'
            }`}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: member.status === 'warning' ? '#0F2030' : '#014761' }}>
                {member.avatar}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[#1C1C1C]" style={{ fontSize: '0.92rem', fontWeight: 700 }}>{member.name}</p>
                {member.status === 'warning' && (
                  <span className="px-2 py-0.5 rounded-lg bg-[#00C271]/15 text-[#0F2030] flex items-center gap-1" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                    <AlertTriangle size={9} />غياب
                  </span>
                )}
              </div>
              <p className="text-[#7A7A7A] mt-0.5" style={{ fontSize: '0.75rem' }}>
                آخر حضور: {member.lastAttendance} • {member.points} نقطة
              </p>
              <div className="flex items-center gap-3 mt-1">
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
                <span className="text-[#C4C4C4]" style={{ fontSize: '0.68rem' }}>
                  {Math.round((member.totalAttendance / member.totalMeetings) * 100)}% حضور
                </span>
              </div>
            </div>

            <ChevronLeft size={16} color="#C4C4C4" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function MemberDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = members.find((m) => m.id === id) || members[0];
  const [notes, setNotes] = useState('يعاني ضغط في الشغل مؤخراً، يحتاج متابعة أكثر...');

  const attendanceRate = Math.round((member.totalAttendance / member.totalMeetings) * 100);
  const history = Array.from({ length: 10 }, (_, i) => i < member.totalAttendance % 10 || Math.random() > 0.4);

  return (
    <div className="flex flex-col min-h-full pb-4 bg-[#F2F3F2]">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
          <ChevronRight size={20} color="white" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/25 border-4 border-white/40 flex items-center justify-center">
            <span className="text-white" style={{ fontSize: '1.6rem', fontWeight: 700 }}>{member.avatar}</span>
          </div>
          <div>
            <h1 className="text-white" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{member.name}</h1>
            <div className="flex items-center gap-1.5 text-white/70" style={{ fontSize: '0.8rem' }}>
              {member.status === 'active'
                ? <span>مخدوم نشيط</span>
                : <><AlertTriangle size={13} color="rgba(255,255,255,0.7)" /><span>يحتاج متابعة</span></>
              }
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-white/60">
              <Phone size={12} color="rgba(255,255,255,0.6)" />
              <p style={{ fontSize: '0.75rem' }}>{member.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Stats */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={15} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>الإحصائيات</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F2F3F2] rounded-2xl p-3 text-center">
              <p className="text-[#014761]" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{attendanceRate}%</p>
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>معدل الحضور</p>
            </div>
            <div className="bg-[#F2F3F2] rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-[#014761]" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{member.points}</p>
                <Star size={14} color="#FBBF24" fill="#FBBF24" />
              </div>
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>النقاط</p>
            </div>
            <div className="bg-[#F2F3F2] rounded-2xl p-3 text-center">
              {member.streak > 0
                ? (
                  <div className="flex items-center justify-center gap-1">
                    <Flame size={18} color="#014761" fill="#014761" />
                    <p className="text-[#014761]" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{member.streak}</p>
                  </div>
                )
                : (
                  <div className="flex items-center justify-center gap-1">
                    <XCircle size={18} color="#DC2626" />
                    <p className="text-[#DC2626]" style={{ fontSize: '1.2rem', fontWeight: 800 }}>0</p>
                  </div>
                )
              }
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>Streak أسابيع</p>
            </div>
            <div className="bg-[#F2F3F2] rounded-2xl p-3 text-center">
              <p className="text-[#014761]" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{member.lastAttendance}</p>
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>آخر حضور</p>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen size={15} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>سجل الحضور (آخر 10)</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {history.map((attended, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: attended ? '#01476118' : '#DC262618' }}
              >
                {attended
                  ? <CheckCircle2 size={16} color="#014761" />
                  : <XCircle size={16} color="#DC2626" />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList size={15} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>ملاحظاتي (للخادم فقط)</h3>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-[#F2F3F2] rounded-2xl p-3 outline-none text-[#3D3D3D] resize-none"
            style={{ fontSize: '0.85rem' }}
          />
          <button className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#014761] text-white" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
            <Save size={14} />
            حفظ الملاحظة
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#014761] text-white"
            style={{ fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
            <PlusCircle size={16} />
            إضافة نقاط
          </button>
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#A8DFD0] text-[#3D3D3D]"
            style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            <ClipboardList size={16} />
            مهمة جديدة
          </button>
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#A8DFD0] text-[#3D3D3D]"
            style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            <MessageSquare size={16} />
            رسالة
          </button>
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#A8DFD0] text-[#3D3D3D]"
            style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            <Phone size={16} />
            اتصال
          </button>
        </div>
      </div>
    </div>
  );
}