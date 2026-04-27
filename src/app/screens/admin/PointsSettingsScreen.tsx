import { useState } from 'react';
import { Star, Pencil, Check, X, Zap, Calendar, CheckSquare, Gift, ArrowRightLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pointsSettings as initialSettings, PointsSettings } from '../../data/mockData';

/* ─────────────── data ─────────────── */

interface PointRow { key: keyof PointsSettings; label: string; hint: string }

const SECTIONS: { title: string; icon: React.ReactNode; color: string; bg: string; rows: PointRow[] }[] = [
  {
    title: 'الحضور والأحداث',
    icon: <Calendar size={15} color="white" />,
    color: '#014761', bg: '#014761',
    rows: [
      { key: 'attendancePoints', label: 'حضور اجتماع أسبوعي', hint: 'يُضاف تلقائياً عند تسجيل الحضور' },
      { key: 'tripPoints',       label: 'حضور رحلة / نشاط',   hint: 'رحلات ونشاطات خارج الكنيسة' },
    ],
  },
  {
    title: 'المهام',
    icon: <CheckSquare size={15} color="white" />,
    color: '#00C271', bg: '#00C271',
    rows: [
      { key: 'taskPoints',          label: 'تنفيذ مهمة عادية', hint: 'تُضاف تلقائياً عند الإرسال' },
      { key: 'spiritualTaskPoints', label: 'مهمة روحية',        hint: 'تُضاف بعد تقييم الخادم يدوياً' },
    ],
  },
  {
    title: 'المكافآت والبونص',
    icon: <Gift size={15} color="white" />,
    color: '#D97706', bg: '#D97706',
    rows: [
      { key: 'streakBonus2Weeks',     label: 'Streak — أسبوعان متتاليان', hint: 'بونص يُضاف تلقائياً' },
      { key: 'streakBonus1Month',     label: 'Streak — شهر كامل',          hint: 'بونص يُضاف تلقائياً' },
      { key: 'firstAttendancePoints', label: 'أول حضور',                    hint: 'مرة واحدة مع Badge' },
      { key: 'groupBonusPoints',      label: 'بونص الحضور الكامل',          hint: 'لكل فرد عند حضور الجميع' },
    ],
  },
];

const LEVELS = [
  { name: 'مبتدئ', range: '0 – 99',   emoji: '🔘', color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' },
  { name: 'نشيط',  range: '100 – 299', emoji: '⭐', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { name: 'قائد',  range: '300 – 599', emoji: '🏆', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { name: 'بطل',   range: '600+',      emoji: '💜', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
];

/* ─────────────── Stepper ─────────────── */

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-xl bg-[#F2F3F2] flex items-center justify-center active:scale-90 transition-transform"
        style={{ fontSize: '1.1rem', color: '#4A4A4A', fontWeight: 700, lineHeight: 1 }}
      >−</button>
      <div className="w-10 h-8 rounded-xl bg-[#014761]/8 flex items-center justify-center">
        <span className="text-[#014761]" style={{ fontSize: '0.92rem', fontWeight: 800 }}>{value}</span>
      </div>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-xl bg-[#014761] flex items-center justify-center active:scale-90 transition-transform"
        style={{ fontSize: '1.1rem', color: 'white', fontWeight: 700, lineHeight: 1 }}
      >+</button>
    </div>
  );
}

/* ─────────────── Screen ─────────────── */

export function PointsSettingsScreen() {
  const [settings, setSettings] = useState<PointsSettings>({ ...initialSettings });
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState<PointsSettings>({ ...initialSettings });
  const [saved, setSaved]       = useState(false);

  const startEdit  = () => { setDraft({ ...settings }); setEditing(true); setSaved(false); };
  const cancelEdit = () => { setDraft({ ...settings }); setEditing(false); };
  const saveEdit   = () => {
    setSettings({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key: keyof PointsSettings, val: number) =>
    setDraft(d => ({ ...d, [key]: val }));

  const examplePoints   = draft.conversionRate * 10;
  const exampleMoney    = 10;

  return (
    <div className="flex flex-col min-h-full bg-[#F2F3F2]">

      {/* ── Header ── */}
      <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]"
        style={{ boxShadow: '0 8px 24px rgba(1,71,97,0.25)' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/60" style={{ fontSize: '0.75rem' }}>أمين الخدمة فقط</p>
            <h1 className="text-white mt-0.5" style={{ fontSize: '1.3rem', fontWeight: 700 }}>إعدادات النقاط</h1>
            <p className="text-white/60 mt-1" style={{ fontSize: '0.75rem' }}>نقاط كل فعل ومعادلة تحويلها لجنيهات</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00C271]/20">
                <Check size={13} color="#00C271" />
                <span className="text-[#00C271]" style={{ fontSize: '0.75rem', fontWeight: 700 }}>حُفظ</span>
              </motion.div>
            )}
            {!editing ? (
              <button onClick={startEdit}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/15 text-white"
                style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                <Pencil size={14} />تعديل
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={cancelEdit}
                  className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                  <X size={16} color="white" />
                </button>
                <button onClick={saveEdit}
                  className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <Save size={16} color="#014761" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-8 flex flex-col gap-4">

        {/* ── Conversion Rate ── */}
        <div className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 4px 16px rgba(1,71,97,0.08)' }}>

          <div className="px-5 pt-5 pb-4 border-b border-[#F0EBE3] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#014761]/10 flex items-center justify-center">
              <ArrowRightLeft size={14} color="#014761" />
            </div>
            <div>
              <p className="text-[#1C1C1C]" style={{ fontSize: '0.92rem', fontWeight: 700 }}>معادلة التحويل</p>
              <p className="text-[#9A9A9A]" style={{ fontSize: '0.7rem' }}>كم نقطة = 1 جنيه مصري</p>
            </div>
          </div>

          <div className="px-5 py-4 flex flex-col gap-3">
            {/* Main rate row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={16} color="#FBBF24" fill="#FBBF24" />
                <span className="text-[#3D3D3D]" style={{ fontSize: '0.88rem', fontWeight: 600 }}>نقطة = 1 جنيه</span>
              </div>
              {editing
                ? <Stepper value={draft.conversionRate} onChange={v => set('conversionRate', v)} />
                : <span className="text-[#014761]" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    {settings.conversionRate}
                  </span>
              }
            </div>

            {/* Live example */}
            <div className="flex items-center gap-2 bg-[#F9F9F9] rounded-2xl px-4 py-3">
              <Zap size={13} color="#D97706" />
              <span className="text-[#7A7A7A]" style={{ fontSize: '0.78rem' }}>
                مثال: {examplePoints} نقطة ={' '}
                <span className="text-[#014761] font-bold">{exampleMoney} جنيه</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Per-action sections ── */}
        {SECTIONS.map(section => (
          <div key={section.title} className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 4px 16px rgba(1,71,97,0.07)' }}>

            {/* Section header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F7F5F2]"
              style={{ background: `${section.bg}12` }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: section.color }}>
                {section.icon}
              </div>
              <p className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                {section.title}
              </p>
            </div>

            {/* Rows */}
            <div className="px-5">
              {section.rows.map((row, i) => (
                <div key={row.key}
                  className={`flex items-center justify-between py-4 ${
                    i < section.rows.length - 1 ? 'border-b border-[#F7F5F2]' : ''
                  }`}>
                  <div className="flex-1 ml-3">
                    <p className="text-[#2D2D2D]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {row.label}
                    </p>
                    <p className="text-[#A8A8A8] mt-0.5" style={{ fontSize: '0.7rem' }}>
                      {row.hint}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {editing ? (
                      <motion.div key="stepper"
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.15 }}>
                        <Stepper value={draft[row.key]} onChange={v => set(row.key, v)} />
                      </motion.div>
                    ) : (
                      <motion.div key="badge"
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.15 }}>
                        <span
                          className="px-3 py-1.5 rounded-xl"
                          style={{
                            fontSize: '0.9rem', fontWeight: 800,
                            color: section.color,
                            background: `${section.color}15`,
                          }}
                        >
                          +{settings[row.key]}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── Levels ── */}
        <div className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 4px 16px rgba(1,71,97,0.07)' }}>

          <div className="px-5 pt-5 pb-4 border-b border-[#F0EBE3] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#014761]/10 flex items-center justify-center">
              <Star size={14} color="#014761" />
            </div>
            <div>
              <p className="text-[#1C1C1C]" style={{ fontSize: '0.92rem', fontWeight: 700 }}>جدول المستويات</p>
              <p className="text-[#9A9A9A]" style={{ fontSize: '0.7rem' }}>للإطلاع فقط — يُعدَّل من الكود</p>
            </div>
          </div>

          <div className="px-4 py-4 flex flex-col gap-2">
            {LEVELS.map((lvl, i) => (
              <motion.div key={lvl.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl border"
                style={{ background: lvl.bg, borderColor: lvl.border }}>

                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${lvl.color}18` }}>
                  <span style={{ fontSize: '1.2rem' }}>{lvl.emoji}</span>
                </div>

                <div className="flex-1">
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: lvl.color }}>{lvl.name}</p>
                  <p style={{ fontSize: '0.72rem', color: `${lvl.color}99`, marginTop: 1 }}>
                    {lvl.range} نقطة
                  </p>
                </div>

                {/* Mini progress bar representing position */}
                <div className="w-16 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    background: lvl.color,
                    width: lvl.name === 'مبتدئ' ? '25%'
                         : lvl.name === 'نشيط'  ? '50%'
                         : lvl.name === 'قائد'  ? '75%'
                         : '100%',
                  }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Save CTA (editing mode) ── */}
        {editing && (
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={saveEdit}
            className="w-full py-4 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
            style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 6px 20px rgba(1,71,97,0.35)' }}>
            <Save size={17} />حفظ الإعدادات
          </motion.button>
        )}

      </div>
    </div>
  );
}
