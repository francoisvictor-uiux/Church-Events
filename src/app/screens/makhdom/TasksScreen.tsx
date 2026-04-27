import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronRight, Send, Upload, Link as LinkIcon, HeartHandshake, BookOpen, Target, BarChart2, CheckSquare, Plus, CheckCircle2, Sparkles, FileText, Calendar, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { tasks, Task, events } from '../../data/mockData';

type Tab = 'الكل' | 'جديدة' | 'منجزة';

const TypeIcon = ({ type, size = 18 }: { type: Task['type']; size?: number }) => {
  if (type === 'روحية') return <HeartHandshake size={size} color="#014761" />;
  if (type === 'قراءة') return <BookOpen size={size} color="#014761" />;
  if (type === 'مسابقة') return <Target size={size} color="#014761" />;
  if (type === 'استبيان') return <BarChart2 size={size} color="#014761" />;
  return <CheckSquare size={size} color="#014761" />;
};

const statusLabel = (status: Task['status']) => {
  if (status === 'new') return { label: 'جديدة', color: '#014761', bg: '#014761/10' };
  if (status === 'in_progress') return { label: 'قيد التنفيذ', color: '#00C271', bg: '#00C271/15' };
  if (status === 'done') return { label: 'منجزة', color: '#16A34A', bg: '#16A34A/10' };
  return { label: 'مرفوضة', color: '#DC2626', bg: '#DC2626/10' };
};

export function MakhdomTasksScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('الكل');
  const navigate = useNavigate();

  const filtered = tasks.filter((t) => {
    if (activeTab === 'جديدة') return t.status === 'new' || t.status === 'in_progress';
    if (activeTab === 'منجزة') return t.status === 'done';
    return true;
  });

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-5 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <h1 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 700 }}>مهامي</h1>
        <div className="flex gap-2">
          {(['الكل', 'جديدة', 'منجزة'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl transition-all ${activeTab === tab ? 'bg-white text-[#014761]' : 'bg-white/15 text-white'}`}
              style={{ fontSize: '0.82rem', fontWeight: activeTab === tab ? 700 : 500 }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {filtered.map((task) => {
          const st = statusLabel(task.status);
          const linkedEvent = task.eventId ? events.find((e) => e.id === task.eventId) : null;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4"
              style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.07)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeIcon type={task.type} size={18} />
                  <span
                    className="px-2 py-0.5 rounded-lg"
                    style={{ fontSize: '0.68rem', fontWeight: 600, color: st.color, background: `${st.color}18` }}
                  >
                    {st.label}
                  </span>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                    style={{
                      background: task.createdBy === 'admin' ? '#7C3AED18' : '#01476110',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: task.createdBy === 'admin' ? '#7C3AED' : '#014761',
                    }}
                  >
                    <Shield size={8} />
                    {task.createdBy === 'admin' ? 'أمين الخدمة' : 'خادم'}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#16A34A]" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  <Plus size={12} strokeWidth={3} />
                  <span>{task.points} نقاط</span>
                </div>
              </div>

              {linkedEvent && (
                <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-xl bg-[#00C271]/10 w-fit">
                  <Calendar size={10} color="#00C271" />
                  <span style={{ fontSize: '0.68rem', color: '#0a7a4b', fontWeight: 600 }}>{linkedEvent.title}</span>
                </div>
              )}

              <h3 className="text-[#1C1C1C] mb-1" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{task.title}</h3>
              <p className="text-[#7A7A7A] mb-3" style={{ fontSize: '0.78rem' }}>
                من {task.from} • الموعد: {task.deadline}
              </p>

              {task.status !== 'done' && (
                <button
                  onClick={() => navigate(`/makhdom/tasks/${task.id}`)}
                  className="w-full py-3 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
                  style={{ fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <span>تنفيذ المهمة</span>
                  <ChevronRight size={15} />
                </button>
              )}

              {task.status === 'done' && (
                <div className="flex items-center gap-2 bg-[#16A34A]/8 rounded-2xl px-3 py-2">
                  <CheckCircle2 size={14} color="#16A34A" />
                  <span className="text-[#16A34A]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                    تم الإرسال {task.submittedAt && `• ${task.submittedAt}`}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles size={48} color="#00C271" />
            <p className="text-[#7A7A7A] mt-3" style={{ fontSize: '0.9rem' }}>لا توجد مهام في هذه الفئة</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === id) || tasks[0];
  const [answer, setAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/makhdom/tasks'), 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-6 bg-[#F2F3F2]">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-[#014761] flex items-center justify-center">
            <CheckCircle2 size={48} color="white" strokeWidth={2} />
          </div>
          <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.3rem', fontWeight: 700 }}>تم إرسال المهمة!</h2>
          <p className="text-[#6B6B6B]" style={{ fontSize: '0.85rem' }}>
            {task.points} نقاط ستُضاف لرصيدك بعد مراجعة الخادم
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-4 bg-[#F2F3F2]">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-6 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <ChevronRight size={20} color="white" />
          </button>
          <h1 className="text-white" style={{ fontSize: '1.1rem', fontWeight: 700 }}>تنفيذ المهمة</h1>
        </div>
        <div className="bg-white/15 rounded-2xl p-4">
          <p className="text-white" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{task.title}</p>
          <div className="flex items-center gap-1 text-white/70 mt-1" style={{ fontSize: '0.78rem' }}>
            <span>من {task.from} • الموعد: {task.deadline} •</span>
            <Plus size={11} strokeWidth={3} color="rgba(255,255,255,0.7)" />
            <span>{task.points} نقاط</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Description */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.07)' }}>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={15} color="#014761" />
            <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.88rem', fontWeight: 700 }}>تفاصيل المهمة</h3>
          </div>
          <p className="text-[#6B6B6B]" style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>{task.description}</p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.07)' }}>
          <h3 className="text-[#1C1C1C] mb-3" style={{ fontSize: '0.88rem', fontWeight: 700 }}>إجابتك</h3>

          {task.inputType === 'text' && (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="اكتب إجابتك هنا..."
              rows={4}
              className="w-full bg-[#F2F3F2] rounded-2xl p-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4] resize-none"
              style={{ fontSize: '0.88rem', border: 'none' }}
            />
          )}

          {task.inputType === 'choice' && task.choices && (
            <div className="flex flex-col gap-2">
              {task.choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => setSelectedChoice(choice)}
                  className={`text-right px-4 py-3 rounded-2xl border-2 transition-all ${
                    selectedChoice === choice
                      ? 'border-[#014761] bg-[#014761]/8 text-[#014761]'
                      : 'border-[#A8DFD0] bg-[#F2F3F2] text-[#3D3D3D]'
                  }`}
                  style={{ fontSize: '0.88rem', fontWeight: selectedChoice === choice ? 600 : 400 }}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {/* Media Options */}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 py-2.5 rounded-2xl border border-[#A8DFD0] flex items-center justify-center gap-1.5 text-[#7A7A7A]"
              style={{ fontSize: '0.78rem' }}>
              <Upload size={14} />
              <span>رفع صورة</span>
            </button>
            <button className="flex-1 py-2.5 rounded-2xl border border-[#A8DFD0] flex items-center justify-center gap-1.5 text-[#7A7A7A]"
              style={{ fontSize: '0.78rem' }}>
              <LinkIcon size={14} />
              <span>رابط</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!answer && !selectedChoice}
          className="w-full py-4 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 16px rgba(1, 71, 97, 0.3)' }}
        >
          <Send size={16} />
          <span>إرسال المهمة</span>
        </button>
      </div>
    </div>
  );
}