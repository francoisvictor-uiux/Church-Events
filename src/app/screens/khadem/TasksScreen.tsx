import { useState } from 'react';
import { ChevronRight, Plus, Check, X, HeartHandshake, BookOpen, Target, BarChart2, CheckSquare, CheckCircle2, RefreshCw, Circle, Calendar, Shield, Pencil, Trash2, Zap, UserCheck } from 'lucide-react';
import { tasks as initialTasks, Task, members, events } from '../../data/mockData';

type Tab = 'الكل' | 'نشطة' | 'منتهية';

const TASK_TYPES = ['روحية', 'قراءة', 'مسابقة', 'استبيان', 'أخرى'] as const;
const INPUT_TYPES = [
  { value: 'text', label: 'إجابة نصية' },
  { value: 'choice', label: 'اختيارات' },
  { value: 'image', label: 'رفع صورة/ملف' },
  { value: 'link', label: 'رابط' },
] as const;

const TypeIcon = ({ type, size = 18 }: { type: string; size?: number }) => {
  if (type === 'روحية') return <HeartHandshake size={size} color="#014761" />;
  if (type === 'قراءة') return <BookOpen size={size} color="#014761" />;
  if (type === 'مسابقة') return <Target size={size} color="#014761" />;
  if (type === 'استبيان') return <BarChart2 size={size} color="#014761" />;
  return <CheckSquare size={size} color="#014761" />;
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'done') return (
    <div className="flex items-center gap-1">
      <CheckCircle2 size={11} color="#16A34A" />
      <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>منجزة</span>
    </div>
  );
  if (status === 'in_progress') return (
    <div className="flex items-center gap-1">
      <RefreshCw size={11} color="#00C271" />
      <span style={{ fontSize: '0.75rem', color: '#00C271', fontWeight: 600 }}>قيد التنفيذ</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1">
      <Circle size={11} color="#014761" fill="#014761" />
      <span style={{ fontSize: '0.75rem', color: '#014761', fontWeight: 600 }}>جديدة</span>
    </div>
  );
};

interface TaskForm {
  title: string;
  assignee: string;
  userType: 'مخدوم' | 'خادم';
  type: string;
  description: string;
  fromDate: string;
  toDate: string;
  periodic: 'once' | 'weekly' | 'monthly';
  inputType: 'text' | 'choice' | 'image' | 'link';
  points: string;
  pointsMode: 'auto' | 'manual';
  eventId: string;
  surveyQuestion: string;
  surveyChoices: string[];
}

const emptyForm: TaskForm = {
  title: '',
  assignee: 'الكل',
  userType: 'مخدوم',
  type: '',
  description: '',
  fromDate: '',
  toDate: '',
  periodic: 'once',
  inputType: 'text',
  points: '',
  pointsMode: 'auto',
  eventId: '',
  surveyQuestion: '',
  surveyChoices: ['', ''],
};

export function KhademTasksScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('الكل');
  const [taskList, setTaskList] = useState<Task[]>([...initialTasks]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyForm);

  const filtered = taskList.filter((t) => {
    if (activeTab === 'نشطة') return t.status === 'new' || t.status === 'in_progress';
    if (activeTab === 'منتهية') return t.status === 'done' || t.status === 'rejected';
    return true;
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (task: Task) => {
    setForm({
      title: task.title,
      assignee: task.assignedTo || 'الكل',
      userType: 'مخدوم',
      type: task.type,
      description: task.description,
      fromDate: '',
      toDate: task.deadline,
      periodic: task.periodic,
      inputType: task.inputType,
      points: String(task.points),
      pointsMode: 'auto',
      eventId: task.eventId || '',
      surveyQuestion: '',
      surveyChoices: task.choices?.length ? [...task.choices, ''] : ['', ''],
    });
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.type || !form.description.trim()) return;

    const baseTask = {
      title: form.title.trim(),
      type: form.type as Task['type'],
      description: form.description.trim(),
      from: 'مريم جورج',
      deadline: form.toDate || 'غير محدد',
      points: parseInt(form.points) || 0,
      inputType: form.inputType,
      periodic: form.periodic,
      eventId: form.eventId || undefined,
      createdBy: 'khadem' as const,
      choices: form.inputType === 'choice' ? form.surveyChoices.filter(Boolean) : undefined,
      assignedTo: form.assignee !== 'الكل' ? form.assignee : undefined,
    };

    if (editingId) {
      setTaskList((prev) =>
        prev.map((t) => t.id === editingId ? { ...t, ...baseTask } : t)
      );
    } else {
      const newTask: Task = {
        id: `t${Date.now()}`,
        status: 'new',
        ...baseTask,
      };
      setTaskList((prev) => [newTask, ...prev]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setTaskList((prev) => prev.filter((t) => t.id !== id));
    setDeletingId(null);
  };

  const setField = <K extends keyof TaskForm>(key: K, val: TaskForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="flex flex-col min-h-full pb-4 bg-[#F2F3F2]">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-5 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white" style={{ fontSize: '1.3rem', fontWeight: 700 }}>المهام</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-[#014761]"
            style={{ fontSize: '0.82rem', fontWeight: 700 }}
          >
            <Plus size={16} />
            إضافة
          </button>
        </div>
        <div className="flex gap-2">
          {(['الكل', 'نشطة', 'منتهية'] as Tab[]).map((tab) => (
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

      <div className="px-5 pt-4 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-14 text-center">
            <CheckSquare size={40} color="#C4C4C4" />
            <p className="text-[#9A9A9A] mt-2" style={{ fontSize: '0.88rem' }}>لا توجد مهام في هذه الفئة</p>
          </div>
        )}

        {filtered.map((task) => {
          const linkedEvent = task.eventId ? events.find((e) => e.id === task.eventId) : null;
          const isDeleting = deletingId === task.id;
          return (
            <div
              key={task.id}
              className="bg-white rounded-3xl p-4"
              style={{ boxShadow: '0 4px 16px rgba(139, 78, 39, 0.07)' }}
            >
              {/* Top row: type + badges + actions */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeIcon type={task.type} size={17} />
                  <span className="px-2 py-0.5 rounded-lg bg-[#014761]/10 text-[#014761]" style={{ fontSize: '0.67rem', fontWeight: 600 }}>
                    {task.type}
                  </span>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                    style={{
                      background: task.createdBy === 'admin' ? '#7C3AED18' : '#01476118',
                      fontSize: '0.67rem', fontWeight: 600,
                      color: task.createdBy === 'admin' ? '#7C3AED' : '#014761',
                    }}
                  >
                    <Shield size={8} />
                    {task.createdBy === 'admin' ? 'أمين الخدمة' : 'خادم'}
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#16A34A]" style={{ fontSize: '0.75rem', fontWeight: 700 }}>+{task.points}نقاط</span>
                  <button
                    onClick={() => openEdit(task)}
                    className="w-7 h-7 rounded-xl bg-[#014761]/10 flex items-center justify-center"
                  >
                    <Pencil size={13} color="#014761" />
                  </button>
                  <button
                    onClick={() => setDeletingId(task.id)}
                    className="w-7 h-7 rounded-xl bg-[#DC2626]/10 flex items-center justify-center"
                  >
                    <Trash2 size={13} color="#DC2626" />
                  </button>
                </div>
              </div>

              {linkedEvent && (
                <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-xl bg-[#00C271]/10 w-fit">
                  <Calendar size={10} color="#00C271" />
                  <span style={{ fontSize: '0.68rem', color: '#0a7a4b', fontWeight: 600 }}>{linkedEvent.title}</span>
                </div>
              )}

              <p className="text-[#1C1C1C] mb-1" style={{ fontSize: '0.92rem', fontWeight: 700 }}>{task.title}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#7A7A7A]" style={{ fontSize: '0.75rem' }}>الموعد: {task.deadline} •</span>
                <StatusBadge status={task.status} />
              </div>

              {/* Delete confirmation */}
              {isDeleting && (
                <div className="flex items-center gap-2 bg-[#DC2626]/8 rounded-2xl px-3 py-2.5 mb-2">
                  <span className="text-[#DC2626] flex-1" style={{ fontSize: '0.8rem', fontWeight: 600 }}>حذف هذه المهمة؟</span>
                  <button onClick={() => handleDelete(task.id)} className="px-3 py-1.5 rounded-xl bg-[#DC2626] text-white" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    حذف
                  </button>
                  <button onClick={() => setDeletingId(null)} className="px-3 py-1.5 rounded-xl bg-[#F2F3F2] text-[#4A4A4A]" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    إلغاء
                  </button>
                </div>
              )}

              {task.status === 'in_progress' && (
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-xl bg-[#014761]/10 text-[#014761] flex items-center justify-center gap-1.5"
                    style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    <Check size={13} />قبول
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center gap-1.5"
                    style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    <X size={13} />رفض
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Task Bottom Sheet */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full bg-white rounded-t-[2rem] max-h-[92vh] overflow-y-auto">
            {/* Sheet header */}
            <div className="sticky top-0 bg-white px-5 pt-5 pb-4 border-b border-[#F0EBE3]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {editingId ? <Pencil size={17} color="#014761" /> : <Plus size={17} color="#014761" />}
                  <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    {editingId ? 'تعديل المهمة' : 'مهمة جديدة'}
                  </h2>
                </div>
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center"
                >
                  <X size={16} color="#4A4A4A" />
                </button>
              </div>
            </div>

            <div className="px-5 pt-4 pb-8 flex flex-col gap-4">
              {/* Title */}
              <FormField label="عنوان المهمة *">
                <input
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="مثال: اقرأ إصحاح 1 من متى"
                  className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                  style={{ fontSize: '0.88rem' }}
                />
              </FormField>

              {/* User type + Assignee */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <FormField label="نوع المستخدم">
                    <div className="flex gap-2">
                      {(['مخدوم', 'خادم'] as const).map((ut) => (
                        <button
                          key={ut}
                          onClick={() => setField('userType', ut)}
                          className={`flex-1 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-1 ${form.userType === ut ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                          style={{ fontSize: '0.8rem', fontWeight: form.userType === ut ? 700 : 400 }}
                        >
                          <UserCheck size={12} />
                          {ut}
                        </button>
                      ))}
                    </div>
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField label="المُكلَّف">
                    <select
                      value={form.assignee}
                      onChange={(e) => setField('assignee', e.target.value)}
                      className="w-full bg-[#F2F3F2] rounded-2xl px-3 py-3 outline-none text-[#1C1C1C]"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option>الكل</option>
                      {members.map((m) => <option key={m.id}>{m.name}</option>)}
                    </select>
                  </FormField>
                </div>
              </div>

              {/* Task Type */}
              <FormField label="نوع المهمة">
                <div className="flex flex-wrap gap-2">
                  {TASK_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setField('type', type)}
                      className={`px-3 py-2 rounded-xl border transition-all ${form.type === type ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                      style={{ fontSize: '0.82rem', fontWeight: form.type === type ? 600 : 400 }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Description */}
              <FormField label="شرح المهمة *">
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="اكتب تفاصيل المهمة..."
                  rows={3}
                  className="w-full bg-[#F2F3F2] rounded-2xl p-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4] resize-none"
                  style={{ fontSize: '0.88rem' }}
                />
              </FormField>

              {/* Dates + Periodic */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <FormField label="من تاريخ">
                    <input type="date" value={form.fromDate} onChange={(e) => setField('fromDate', e.target.value)}
                      className="w-full bg-[#F2F3F2] rounded-2xl px-3 py-3 outline-none text-[#1C1C1C]"
                      style={{ fontSize: '0.82rem', direction: 'ltr' }} />
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField label="إلى تاريخ">
                    <input type="date" value={form.toDate} onChange={(e) => setField('toDate', e.target.value)}
                      className="w-full bg-[#F2F3F2] rounded-2xl px-3 py-3 outline-none text-[#1C1C1C]"
                      style={{ fontSize: '0.82rem', direction: 'ltr' }} />
                  </FormField>
                </div>
              </div>

              <FormField label="دورية">
                <div className="flex gap-2">
                  {([['once', 'مرة واحدة'], ['weekly', 'أسبوعي'], ['monthly', 'شهري']] as const).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setField('periodic', val)}
                      className={`flex-1 py-2.5 rounded-xl border transition-all ${form.periodic === val ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                      style={{ fontSize: '0.78rem', fontWeight: form.periodic === val ? 600 : 400 }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Input Type (المطلوب) */}
              <FormField label="المطلوب من المخدوم">
                <div className="flex flex-wrap gap-2">
                  {INPUT_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setField('inputType', value)}
                      className={`px-3 py-2 rounded-xl border transition-all ${form.inputType === value ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                      style={{ fontSize: '0.8rem', fontWeight: form.inputType === value ? 600 : 400 }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Survey fields */}
              {form.type === 'استبيان' && (
                <div className="bg-[#F9F6FF] rounded-2xl p-3 border border-[#7C3AED]/20">
                  <p className="text-[#7C3AED] mb-3" style={{ fontSize: '0.83rem', fontWeight: 700 }}>إعداد الاستبيان</p>
                  <FormField label="السؤال">
                    <input
                      value={form.surveyQuestion}
                      onChange={(e) => setField('surveyQuestion', e.target.value)}
                      placeholder="اكتب السؤال..."
                      className="w-full bg-white rounded-xl px-3 py-2.5 outline-none text-[#1C1C1C] border border-[#E8DDD4]"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </FormField>
                  <p className="text-[#3D3D3D] mt-3 mb-2" style={{ fontSize: '0.83rem', fontWeight: 600 }}>الاختيارات</p>
                  {form.surveyChoices.map((choice, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <input
                        value={choice}
                        onChange={(e) => {
                          const updated = [...form.surveyChoices];
                          updated[i] = e.target.value;
                          setField('surveyChoices', updated);
                        }}
                        placeholder={`الخيار ${i + 1}`}
                        className="flex-1 bg-white rounded-xl px-3 py-2.5 outline-none text-[#1C1C1C] border border-[#E8DDD4]"
                        style={{ fontSize: '0.85rem' }}
                      />
                      {form.surveyChoices.length > 2 && (
                        <button
                          onClick={() => setField('surveyChoices', form.surveyChoices.filter((_, j) => j !== i))}
                          className="w-7 h-7 rounded-lg bg-[#DC2626]/10 flex items-center justify-center"
                        >
                          <X size={13} color="#DC2626" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setField('surveyChoices', [...form.surveyChoices, ''])}
                    className="flex items-center gap-1 text-[#7C3AED]"
                    style={{ fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    <Plus size={13} />
                    إضافة خيار
                  </button>
                </div>
              )}

              {/* Points + Points mode */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <FormField label="النقاط">
                    <input
                      type="number"
                      value={form.points}
                      onChange={(e) => setField('points', e.target.value)}
                      placeholder="10"
                      className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C]"
                      style={{ fontSize: '0.88rem' }}
                    />
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField label="إضافة النقاط">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setField('pointsMode', 'auto')}
                        className={`flex-1 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-1 ${form.pointsMode === 'auto' ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                        style={{ fontSize: '0.73rem', fontWeight: form.pointsMode === 'auto' ? 700 : 400 }}
                      >
                        <Zap size={11} />
                        تلقائي
                      </button>
                      <button
                        onClick={() => setField('pointsMode', 'manual')}
                        className={`flex-1 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-1 ${form.pointsMode === 'manual' ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                        style={{ fontSize: '0.73rem', fontWeight: form.pointsMode === 'manual' ? 700 : 400 }}
                      >
                        <UserCheck size={11} />
                        يدوي
                      </button>
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Linked Event */}
              <FormField label="الحدث المرتبط" hint="اختياري — اتركه فارغاً للمهام المستقلة">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setField('eventId', '')}
                    className={`px-4 py-2.5 rounded-xl border text-right transition-all ${form.eventId === '' ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                    style={{ fontSize: '0.83rem', fontWeight: form.eventId === '' ? 600 : 400 }}
                  >
                    بدون حدث (مهمة مستقلة)
                  </button>
                  {events.filter((e) => e.status === 'upcoming').map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setField('eventId', e.id)}
                      className={`px-4 py-2.5 rounded-xl border text-right transition-all ${form.eventId === e.id ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                      style={{ fontSize: '0.83rem', fontWeight: form.eventId === e.id ? 600 : 400 }}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={13} />
                        <span>{e.title}</span>
                        <span className="opacity-50 text-xs mr-auto">{e.date}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.type || !form.description.trim()}
                className="w-full py-4 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}
              >
                <Check size={16} />
                {editingId ? 'حفظ التعديلات' : 'إضافة المهمة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[#3D3D3D] mb-1 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
        {label}
        {hint && <span className="text-[#9A9A9A] mr-1" style={{ fontSize: '0.73rem', fontWeight: 400 }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}
