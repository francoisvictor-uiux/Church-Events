import { useState } from 'react';
import { Search, Plus, X, AlertTriangle, Star, Flame, XCircle, FileText, MessageSquare, ChevronLeft, ChevronRight, User, Phone, MapPin, GraduationCap, Briefcase, Heart, Calendar, Hash, Shield } from 'lucide-react';
import { members as initialMembers, Member } from '../../data/mockData';

type Tab = 'الكل' | 'مخدومون' | 'خدام' | 'تحتاج متابعة';
type Step = 1 | 2;

const EGYPTIAN_GOVERNORATES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الشرقية', 'الدقهلية', 'البحيرة', 'المنوفية', 'القليوبية', 'الغربية', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد', 'مطروح'];
const MARITAL_OPTIONS = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];

interface UserForm {
  // Step 1
  name: string;
  phone: string;
  role: 'مخدوم' | 'خادم';
  servantName: string;
  // Step 2
  nationalId: string;
  governorate: string;
  city: string;
  district: string;
  street: string;
  birthDate: string;
  batch: string;
  faculty: string;
  job: string;
  maritalStatus: string;
}

const emptyForm: UserForm = {
  name: '', phone: '', role: 'مخدوم', servantName: '',
  nationalId: '', governorate: '', city: '', district: '', street: '',
  birthDate: '', batch: '', faculty: '', job: '', maritalStatus: '',
};

export function UsersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('الكل');
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [memberList, setMemberList] = useState<Member[]>([...initialMembers]);
  const [selected, setSelected] = useState<Member | null>(null);

  const setF = <K extends keyof UserForm>(k: K, v: UserForm[K]) => setForm(f => ({ ...f, [k]: v }));

  const filtered = memberList.filter((m) => {
    const matchName = m.name.includes(query);
    if (activeTab === 'تحتاج متابعة') return matchName && m.status === 'warning';
    if (activeTab === 'مخدومون') return matchName && m.role !== 'khadem';
    if (activeTab === 'خدام') return matchName && m.role === 'khadem';
    return matchName;
  });

  const openAdd = () => { setForm(emptyForm); setStep(1); setShowAdd(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    const avatar = form.name.trim()[0] || '؟';
    const newMember: Member = {
      id: `m${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      points: 0, streak: 0,
      lastAttendance: '—',
      totalAttendance: 0, totalMeetings: 0,
      status: 'active',
      group: form.servantName || '',
      avatar,
      role: form.role === 'خادم' ? 'khadem' : 'makhdom',
      servantName: form.servantName || undefined,
      nationalId: form.nationalId || undefined,
      governorate: form.governorate || undefined,
      city: form.city || undefined,
      district: form.district || undefined,
      street: form.street || undefined,
      birthDate: form.birthDate || undefined,
      batch: form.batch || undefined,
      faculty: form.faculty || undefined,
      job: form.job || undefined,
      maritalStatus: form.maritalStatus || undefined,
    };
    setMemberList(prev => [newMember, ...prev]);
    setShowAdd(false);
  };

  const step1Valid = form.name.trim().length > 0 && form.phone.trim().length >= 11;

  return (
    <div className="flex flex-col min-h-full pb-4 bg-[#F2F3F2]">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-5 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white" style={{ fontSize: '1.3rem', fontWeight: 700 }}>المستخدمون</h1>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-[#014761]" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
            <Plus size={16} />إضافة
          </button>
        </div>
        <div className="flex items-center gap-3 bg-white/15 rounded-2xl px-4 py-3 mb-3">
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم..."
            className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none" style={{ fontSize: '0.88rem' }} />
        </div>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {(['الكل', 'مخدومون', 'خدام', 'تحتاج متابعة'] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-2xl whitespace-nowrap transition-all ${activeTab === tab ? 'bg-white text-[#014761]' : 'bg-white/15 text-white'}`}
              style={{ fontSize: '0.78rem', fontWeight: activeTab === tab ? 700 : 500 }}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-3">
        <div className="flex gap-3">
          {[
            { label: 'إجمالي الأعضاء', value: memberList.length, color: '#014761' },
            { label: 'نشطون', value: memberList.filter(m => m.status === 'active').length, color: '#16A34A' },
            { label: 'يحتاجون متابعة', value: memberList.filter(m => m.status === 'warning').length, color: '#00C271' },
          ].map(stat => (
            <div key={stat.label} className="flex-1 bg-white rounded-2xl p-3 text-center" style={{ boxShadow: '0 2px 8px rgba(1, 71, 97, 0.06)' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color }}>{stat.value}</p>
              <p className="text-[#7A7A7A]" style={{ fontSize: '0.68rem' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {filtered.map((member) => (
          <button key={member.id} onClick={() => setSelected(member)}
            className="bg-white rounded-3xl p-4 flex items-center gap-3 w-full text-right"
            style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${member.status === 'warning' ? 'bg-[#00C271]/20' : 'bg-[#014761]/12'}`}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: member.status === 'warning' ? '#0F2030' : '#014761' }}>{member.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[#1C1C1C]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{member.name}</p>
                {member.status === 'warning' && <AlertTriangle size={12} color="#00C271" />}
                {member.role === 'khadem' && (
                  <span className="px-1.5 py-0.5 rounded-md bg-[#014761]/10 text-[#014761]" style={{ fontSize: '0.6rem', fontWeight: 700 }}>خادم</span>
                )}
              </div>
              <p className="text-[#7A7A7A] mt-0.5" style={{ fontSize: '0.75rem' }}>
                {member.points} نقطة
                {member.faculty && ` • ${member.faculty}`}
              </p>
              <p className="text-[#C4C4C4]" style={{ fontSize: '0.7rem' }}>آخر حضور: {member.lastAttendance}</p>
            </div>
            <div className="text-left">
              <p className="text-[#014761]" style={{ fontSize: '0.88rem', fontWeight: 700 }}>{member.points}</p>
              <p className="text-[#C4C4C4]" style={{ fontSize: '0.68rem' }}>نقطة</p>
            </div>
          </button>
        ))}
      </div>

      {/* Member Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full bg-white rounded-t-[2rem] p-6 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#014761]/15 flex items-center justify-center">
                  <span className="text-[#014761]" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selected.avatar}</span>
                </div>
                <div>
                  <p className="text-[#1C1C1C]" style={{ fontSize: '1rem', fontWeight: 700 }}>{selected.name}</p>
                  {selected.faculty && <p className="text-[#7A7A7A]" style={{ fontSize: '0.75rem' }}>{selected.faculty}</p>}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X size={16} color="#4A4A4A" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'النقاط', value: <div className="flex items-center gap-1"><span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{selected.points}</span><Star size={12} color="#FBBF24" fill="#FBBF24" /></div> },
                { label: 'Streak', value: <div className="flex items-center gap-1">{selected.streak > 0 ? <><Flame size={13} color="#014761" fill="#014761" /><span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{selected.streak} أسابيع</span></> : <><XCircle size={13} color="#9A9A9A" /><span style={{ fontSize: '0.88rem', fontWeight: 700 }}>0</span></>}</div> },
                { label: 'الحضور', value: <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{selected.totalAttendance}/{selected.totalMeetings}</span> },
                { label: 'آخر حضور', value: <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{selected.lastAttendance}</span> },
              ].map(stat => (
                <div key={stat.label} className="bg-[#F2F3F2] rounded-2xl p-3">
                  <p className="text-[#9A9A9A] mb-1" style={{ fontSize: '0.72rem' }}>{stat.label}</p>
                  {stat.value}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <button className="w-full py-3.5 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2" style={{ fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
                <Plus size={16} />إضافة / خصم نقاط
              </button>
              <button className="w-full py-3.5 rounded-2xl border border-[#A8DFD0] text-[#3D3D3D] flex items-center justify-center gap-2" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                <FileText size={16} />إرسال مهمة
              </button>
              <button className="w-full py-3.5 rounded-2xl border border-[#A8DFD0] text-[#3D3D3D] flex items-center justify-center gap-2" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                <MessageSquare size={16} />رسالة شخصية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User — 2-Step Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full bg-white rounded-t-[2rem] max-h-[92vh] overflow-y-auto">

            {/* Sticky header with step indicator */}
            <div className="sticky top-0 bg-white px-5 pt-5 pb-4 border-b border-[#F0EBE3]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>إضافة مستخدم</h2>
                  <p className="text-[#9A9A9A] mt-0.5" style={{ fontSize: '0.72rem' }}>
                    {step === 1 ? 'الخطوة 1 من 2 — البيانات الأساسية' : 'الخطوة 2 من 2 — البيانات التفصيلية (اختيارية)'}
                  </p>
                </div>
                <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <X size={16} color="#4A4A4A" />
                </button>
              </div>
              {/* Progress bar */}
              <div className="flex gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[#014761]" />
                <div className={`flex-1 h-1.5 rounded-full transition-all ${step === 2 ? 'bg-[#014761]' : 'bg-[#C8EDE5]'}`} />
              </div>
            </div>

            <div className="px-5 pt-5 pb-8 flex flex-col gap-4">

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <>
                  {/* Name */}
                  <Field label="الاسم الكامل *" icon={<User size={14} color="#014761" />}>
                    <input value={form.name} onChange={e => setF('name', e.target.value)} placeholder="الاسم الرباعي"
                      className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                      style={{ fontSize: '0.88rem' }} />
                  </Field>

                  {/* Phone */}
                  <Field label="رقم الهاتف *" icon={<Phone size={14} color="#014761" />}>
                    <div className="flex items-center gap-2 bg-[#F2F3F2] rounded-2xl px-4 py-3">
                      <span className="text-[#7A7A7A]" style={{ fontSize: '0.85rem' }}>🇪🇬 +20</span>
                      <div className="w-px h-5 bg-[#D4D4D4]" />
                      <input value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="01X XXXX XXXX"
                        type="tel" className="flex-1 bg-transparent outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                        style={{ fontSize: '0.88rem', direction: 'ltr' }} />
                    </div>
                    {form.phone.length > 0 && form.phone.length < 11 && (
                      <p className="text-red-400 mt-1" style={{ fontSize: '0.73rem' }}>رقم مصري صحيح — 11 رقم تبدأ بـ 01</p>
                    )}
                  </Field>

                  {/* Role */}
                  <Field label="الدور" icon={<Shield size={14} color="#014761" />}>
                    <div className="flex gap-3">
                      {(['مخدوم', 'خادم'] as const).map(r => (
                        <button key={r} onClick={() => setF('role', r)}
                          className={`flex-1 py-3 rounded-2xl border-2 transition-all ${form.role === r ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                          style={{ fontSize: '0.88rem', fontWeight: form.role === r ? 700 : 400 }}>{r}</button>
                      ))}
                    </div>
                  </Field>

                  {/* Servant (only for مخدوم) */}
                  {form.role === 'مخدوم' && (
                    <Field label="الخادم المسؤول" icon={<User size={14} color="#014761" />}>
                      <input value={form.servantName} onChange={e => setF('servantName', e.target.value)} placeholder="اسم الخادم"
                        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                        style={{ fontSize: '0.88rem' }} />
                    </Field>
                  )}

                  <div className="flex gap-3 mt-2">
                    <button onClick={() => setShowAdd(false)}
                      className="flex-1 py-3.5 rounded-2xl border border-[#E8DDD4] text-[#4A4A4A]"
                      style={{ fontSize: '0.88rem', fontWeight: 600 }}>إلغاء</button>
                    <button onClick={() => setStep(2)} disabled={!step1Valid}
                      className="flex-1 py-3.5 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ fontSize: '0.88rem', fontWeight: 700, boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
                      التالي
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <>
                  <div className="flex items-center gap-2 bg-[#014761]/8 rounded-2xl px-4 py-2.5">
                    <User size={14} color="#014761" />
                    <div>
                      <p className="text-[#014761]" style={{ fontSize: '0.83rem', fontWeight: 700 }}>{form.name}</p>
                      <p className="text-[#7A7A7A]" style={{ fontSize: '0.72rem' }}>{form.phone} • {form.role}</p>
                    </div>
                  </div>

                  <p className="text-[#9A9A9A]" style={{ fontSize: '0.78rem' }}>
                    هذه الحقول اختيارية — يمكن للمستخدم إكمالها لاحقاً من ملفه الشخصي
                  </p>

                  {/* National ID */}
                  <Field label="الرقم القومي" icon={<Hash size={14} color="#014761" />}>
                    <input value={form.nationalId} onChange={e => setF('nationalId', e.target.value)} placeholder="14 رقم"
                      maxLength={14} type="tel"
                      className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                      style={{ fontSize: '0.88rem', direction: 'ltr', letterSpacing: '0.05em' }} />
                  </Field>

                  {/* Address */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} color="#014761" />
                      <label className="text-[#3D3D3D]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>العنوان بالتفصيل</label>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Governorate */}
                      <select value={form.governorate} onChange={e => setF('governorate', e.target.value)}
                        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C]"
                        style={{ fontSize: '0.85rem' }}>
                        <option value="">المحافظة</option>
                        {EGYPTIAN_GOVERNORATES.map(g => <option key={g}>{g}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <input value={form.city} onChange={e => setF('city', e.target.value)} placeholder="المدينة / المركز"
                          className="flex-1 bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                          style={{ fontSize: '0.85rem' }} />
                        <input value={form.district} onChange={e => setF('district', e.target.value)} placeholder="الحي"
                          className="flex-1 bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                          style={{ fontSize: '0.85rem' }} />
                      </div>
                      <input value={form.street} onChange={e => setF('street', e.target.value)} placeholder="اسم الشارع"
                        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                        style={{ fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  {/* Birth Date + Batch */}
                  <div className="flex gap-3">
                    <Field label="تاريخ الميلاد" icon={<Calendar size={14} color="#014761" />} flex>
                      <input type="date" value={form.birthDate} onChange={e => setF('birthDate', e.target.value)}
                        className="w-full bg-[#F2F3F2] rounded-2xl px-3 py-3 outline-none text-[#1C1C1C]"
                        style={{ fontSize: '0.82rem', direction: 'ltr' }} />
                    </Field>
                    <Field label="الدفعة (سنة الانضمام)" icon={<Hash size={14} color="#014761" />} flex>
                      <input value={form.batch} onChange={e => setF('batch', e.target.value)} placeholder="مثال: 2022"
                        type="number" min="2000" max="2030"
                        className="w-full bg-[#F2F3F2] rounded-2xl px-3 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                        style={{ fontSize: '0.85rem' }} />
                    </Field>
                  </div>

                  {/* Faculty */}
                  <Field label="الكلية / الجامعة" icon={<GraduationCap size={14} color="#014761" />}>
                    <input value={form.faculty} onChange={e => setF('faculty', e.target.value)} placeholder="مثال: كلية الهندسة، جامعة القاهرة"
                      className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                      style={{ fontSize: '0.85rem' }} />
                  </Field>

                  {/* Job */}
                  <Field label="الوظيفة / العمل" icon={<Briefcase size={14} color="#014761" />}>
                    <input value={form.job} onChange={e => setF('job', e.target.value)} placeholder="مثال: مهندس، طالب، طبيب..."
                      className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                      style={{ fontSize: '0.85rem' }} />
                  </Field>

                  {/* Marital Status */}
                  <Field label="الحالة الاجتماعية" icon={<Heart size={14} color="#014761" />}>
                    <div className="flex gap-2 flex-wrap">
                      {MARITAL_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => setF('maritalStatus', form.maritalStatus === opt ? '' : opt)}
                          className={`px-4 py-2.5 rounded-xl border-2 transition-all ${form.maritalStatus === opt ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                          style={{ fontSize: '0.85rem', fontWeight: form.maritalStatus === opt ? 700 : 400 }}>{opt}</button>
                      ))}
                    </div>
                  </Field>

                  {/* Navigation */}
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => setStep(1)}
                      className="flex-1 py-3.5 rounded-2xl border border-[#E8DDD4] text-[#4A4A4A] flex items-center justify-center gap-2"
                      style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                      <ChevronRight size={16} />السابق
                    </button>
                    <button onClick={handleSave}
                      className="flex-1 py-3.5 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
                      style={{ fontSize: '0.88rem', fontWeight: 700, boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
                      <Plus size={16} />إضافة المستخدم
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, icon, children, flex }: { label: string; icon?: React.ReactNode; children: React.ReactNode; flex?: boolean }) {
  return (
    <div className={flex ? 'flex-1' : ''}>
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <label className="text-[#3D3D3D]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</label>
      </div>
      {children}
    </div>
  );
}
