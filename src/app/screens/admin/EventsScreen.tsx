import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, ChevronLeft, Users, X, ChevronRight, Bus, Handshake, Calendar, Wallet, ClipboardList, FileText, Image, CheckSquare, HeartHandshake, BookOpen, Target, BarChart2, Check, Shield, RefreshCw, CheckCircle2, Circle, Pencil, Trash2, Zap, UserCheck, Headphones } from 'lucide-react';
import { events, tasks as initialTasks, Task, members } from '../../data/mockData';

type Tab = 'قادمة' | 'سابقة';
type Step = 1 | 2 | 3;

const EventTypeIcon = ({ type, size = 18 }: { type: string; size?: number }) => {
  if (type === 'رحلة') return <Bus size={size} color="#014761" />;
  if (type === 'خدمة') return <Handshake size={size} color="#014761" />;
  return <Calendar size={size} color="#014761" />;
};

const StepHeaderIcon = ({ step }: { step: Step }) => {
  if (step === 1) return <ClipboardList size={16} color="#014761" />;
  if (step === 2) return <FileText size={16} color="#014761" />;
  return <Image size={16} color="#014761" />;
};

const stepTitle = (step: Step) => {
  if (step === 1) return 'المعلومات الأساسية';
  if (step === 2) return 'التفاصيل';
  return 'المحتوى';
};

const TypeIcon = ({ type, size = 15 }: { type: string; size?: number }) => {
  if (type === 'روحية') return <HeartHandshake size={size} color="#014761" />;
  if (type === 'قراءة') return <BookOpen size={size} color="#014761" />;
  if (type === 'مسابقة') return <Target size={size} color="#014761" />;
  if (type === 'استبيان') return <BarChart2 size={size} color="#014761" />;
  return <CheckSquare size={size} color="#014761" />;
};

const TaskStatusBadge = ({ status }: { status: string }) => {
  if (status === 'done') return (
    <div className="flex items-center gap-1">
      <CheckCircle2 size={10} color="#16A34A" />
      <span style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 600 }}>منجزة</span>
    </div>
  );
  if (status === 'in_progress') return (
    <div className="flex items-center gap-1">
      <RefreshCw size={10} color="#00C271" />
      <span style={{ fontSize: '0.7rem', color: '#00C271', fontWeight: 600 }}>قيد التنفيذ</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1">
      <Circle size={10} color="#014761" fill="#014761" />
      <span style={{ fontSize: '0.7rem', color: '#014761', fontWeight: 600 }}>جديدة</span>
    </div>
  );
};

interface TaskForm { title: string; userType: 'مخدوم' | 'خادم'; assignee: string; type: string; description: string; toDate: string; periodic: 'once' | 'weekly' | 'monthly'; inputType: 'text' | 'choice' | 'image' | 'link'; points: string; pointsMode: 'auto' | 'manual'; }
const emptyTaskForm: TaskForm = { title: '', userType: 'مخدوم', assignee: 'الكل', type: '', description: '', toDate: '', periodic: 'once', inputType: 'text', points: '', pointsMode: 'auto' };

interface ProgramItem { time: string; activity: string; notes: string; }
interface EventFormState {
  title: string; eventType: string; startDate: string; startTime: string; endDate: string; endTime: string; location: string;
  program: ProgramItem[];
  description: string; paid: 'مجاني' | 'مدفوع'; price: string; invitees: string; regStatus: string;
  alerts: string[];
  photos: string[]; audioName: string; textSummary: string; notifyWhen: string;
}
const emptyEventForm: EventFormState = {
  title: '', eventType: 'اجتماع', startDate: '', startTime: '', endDate: '', endTime: '', location: '',
  program: [{ time: '', activity: '', notes: '' }],
  description: '', paid: 'مجاني', price: '', invitees: 'الكل', regStatus: 'مفتوح',
  alerts: [''],
  photos: [], audioName: '', textSummary: '', notifyWhen: 'الآن',
};

export function AdminEventsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('قادمة');
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [eventForm, setEventForm] = useState<EventFormState>(emptyEventForm);
  const setEF = <K extends keyof EventFormState>(k: K, v: EventFormState[K]) => setEventForm(f => ({ ...f, [k]: v }));
  const [tasksEventId, setTasksEventId] = useState<string | null>(null);
  const [taskList, setTaskList] = useState<Task[]>([...initialTasks]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState<TaskForm>(emptyTaskForm);
  const navigate = useNavigate();

  const filtered = events.filter((e) => (activeTab === 'قادمة' ? e.status === 'upcoming' : e.status === 'past'));
  const selectedEvent = tasksEventId ? events.find((e) => e.id === tasksEventId) : null;
  const eventTasks = tasksEventId ? taskList.filter((t) => t.eventId === tasksEventId) : [];

  const setTF = <K extends keyof TaskForm>(k: K, v: TaskForm[K]) => setTaskForm(f => ({ ...f, [k]: v }));

  const openAddTask = () => { setTaskForm(emptyTaskForm); setEditingTaskId(null); setShowTaskForm(true); };
  const openEditTask = (t: Task) => {
    setTaskForm({ title: t.title, userType: 'مخدوم', assignee: t.assignedTo || 'الكل', type: t.type, description: t.description, toDate: t.deadline, periodic: t.periodic, inputType: t.inputType, points: String(t.points), pointsMode: 'auto' });
    setEditingTaskId(t.id); setShowTaskForm(true);
  };
  const handleSaveTask = () => {
    if (!taskForm.title.trim() || !taskForm.type || !taskForm.description.trim()) return;
    const base = { title: taskForm.title.trim(), type: taskForm.type as Task['type'], description: taskForm.description.trim(), from: 'بطرس رمزي', deadline: taskForm.toDate || 'غير محدد', points: parseInt(taskForm.points) || 0, inputType: taskForm.inputType, periodic: taskForm.periodic, createdBy: 'admin' as const, eventId: tasksEventId!, assignedTo: taskForm.assignee !== 'الكل' ? taskForm.assignee : undefined };
    if (editingTaskId) {
      setTaskList(prev => prev.map(t => t.id === editingTaskId ? { ...t, ...base } : t));
    } else {
      setTaskList(prev => [{ id: `t${Date.now()}`, status: 'new', ...base }, ...prev]);
    }
    setShowTaskForm(false); setEditingTaskId(null);
  };
  const handleDeleteTask = (id: string) => { setTaskList(prev => prev.filter(t => t.id !== id)); setDeletingTaskId(null); };

  return (
    <div className="flex flex-col min-h-full pb-4 bg-[#F2F3F2]">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-5 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white" style={{ fontSize: '1.3rem', fontWeight: 700 }}>الأحداث</h1>
          <button
            onClick={() => { setShowAdd(true); setStep(1); }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-[#014761]"
            style={{ fontSize: '0.82rem', fontWeight: 700 }}
          >
            <Plus size={16} />
            إضافة
          </button>
        </div>
        <div className="flex gap-2">
          {(['قادمة', 'سابقة'] as Tab[]).map((tab) => (
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
        {filtered.map((event) => {
          const eventTaskCount = taskList.filter((t) => t.eventId === event.id).length;
          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl p-4"
              style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-lg bg-[#014761]/10 text-[#014761]" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                    {event.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg ${event.registrationStatus === 'مفتوح' ? 'bg-green-50 text-green-600' : 'bg-[#00C271]/15 text-[#0F2030]'}`}
                    style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                    {event.registrationStatus}
                  </span>
                  {eventTaskCount > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] flex items-center gap-1"
                      style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                      <CheckSquare size={9} />
                      {eventTaskCount} مهام
                    </span>
                  )}
                </div>
                <EventTypeIcon type={event.type} size={18} />
              </div>

              <h3 className="text-[#1C1C1C] mb-1" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{event.title}</h3>
              <p className="text-[#7A7A7A] mb-3" style={{ fontSize: '0.78rem' }}>{event.date} • {event.location}</p>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Users size={13} color="#00C271" />
                  <span className="text-[#4A4A4A]" style={{ fontSize: '0.78rem' }}>
                    {event.committed} ملتزم من {event.total} مدعو
                  </span>
                </div>
                {event.paid && (
                  <div className="flex items-center gap-1">
                    <Wallet size={12} color="#0F2030" />
                    <span className="text-[#0F2030]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{event.price}ج</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-[#014761] text-white" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  إدارة المشتركين
                </button>
                <button
                  onClick={() => { setTasksEventId(event.id); setShowAddTask(false); }}
                  className="flex-1 py-2.5 rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/8 text-[#7C3AED] flex items-center justify-center gap-1"
                  style={{ fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <CheckSquare size={13} />
                  مهام الحدث
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Tasks Bottom Sheet */}
      {tasksEventId && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full bg-white rounded-t-[2rem] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-5 pt-5 pb-4 border-b border-[#F0EBE3]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>مهام الحدث</h2>
                  <p className="text-[#7A7A7A] mt-0.5" style={{ fontSize: '0.78rem' }}>{selectedEvent.title}</p>
                </div>
                <button onClick={() => { setTasksEventId(null); setShowTaskForm(false); setEditingTaskId(null); }} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <X size={16} color="#4A4A4A" />
                </button>
              </div>
            </div>

            <div className="px-5 pt-4 pb-6 flex flex-col gap-3">
              {/* Add / Edit form */}
              {showTaskForm ? (
                <div className="bg-[#F9F9F9] rounded-3xl p-4 border border-[#E8DDD4]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[#1C1C1C]" style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      {editingTaskId ? 'تعديل المهمة' : 'مهمة جديدة للحدث'}
                    </h3>
                    <button onClick={() => { setShowTaskForm(false); setEditingTaskId(null); }} className="w-7 h-7 rounded-full bg-[#F0EBE3] flex items-center justify-center">
                      <X size={14} color="#4A4A4A" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Title */}
                    <div>
                      <label className="text-[#3D3D3D] mb-1.5 block" style={{ fontSize: '0.83rem', fontWeight: 600 }}>عنوان المهمة *</label>
                      <input value={taskForm.title} onChange={e => setTF('title', e.target.value)} placeholder="عنوان المهمة..."
                        className="w-full bg-white rounded-2xl px-4 py-2.5 outline-none text-[#1C1C1C] border border-[#E8DDD4]" style={{ fontSize: '0.85rem' }} />
                    </div>
                    {/* User type + Assignee */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[#3D3D3D] mb-1.5 block" style={{ fontSize: '0.83rem', fontWeight: 600 }}>نوع المستخدم</label>
                        <div className="flex gap-2">
                          {(['مخدوم', 'خادم'] as const).map(ut => (
                            <button key={ut} onClick={() => setTF('userType', ut)}
                              className={`flex-1 py-2 rounded-xl border transition-all text-center ${taskForm.userType === ut ? 'bg-[#014761] border-[#014761] text-white' : 'bg-white border-[#A8DFD0] text-[#3D3D3D]'}`}
                              style={{ fontSize: '0.78rem', fontWeight: taskForm.userType === ut ? 700 : 400 }}>{ut}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-[#3D3D3D] mb-1.5 block" style={{ fontSize: '0.83rem', fontWeight: 600 }}>المُكلَّف</label>
                        <select value={taskForm.assignee} onChange={e => setTF('assignee', e.target.value)}
                          className="w-full bg-white rounded-2xl px-3 py-2.5 outline-none text-[#1C1C1C] border border-[#E8DDD4]" style={{ fontSize: '0.82rem' }}>
                          <option>الكل</option>
                          {members.map(m => <option key={m.id}>{m.name}</option>)}
                        </select>
                      </div>
                    </div>
                    {/* Type */}
                    <div>
                      <label className="text-[#3D3D3D] mb-1.5 block" style={{ fontSize: '0.83rem', fontWeight: 600 }}>نوع المهمة</label>
                      <div className="flex flex-wrap gap-2">
                        {['روحية', 'قراءة', 'مسابقة', 'استبيان', 'أخرى'].map(type => (
                          <button key={type} onClick={() => setTF('type', type)}
                            className={`px-3 py-1.5 rounded-xl border transition-all ${taskForm.type === type ? 'bg-[#014761] border-[#014761] text-white' : 'bg-white border-[#A8DFD0] text-[#3D3D3D]'}`}
                            style={{ fontSize: '0.8rem', fontWeight: taskForm.type === type ? 600 : 400 }}>{type}</button>
                        ))}
                      </div>
                    </div>
                    {/* Description */}
                    <div>
                      <label className="text-[#3D3D3D] mb-1.5 block" style={{ fontSize: '0.83rem', fontWeight: 600 }}>الوصف *</label>
                      <textarea value={taskForm.description} onChange={e => setTF('description', e.target.value)} rows={2}
                        placeholder="تفاصيل المهمة..." className="w-full bg-white rounded-2xl p-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4] resize-none border border-[#E8DDD4]"
                        style={{ fontSize: '0.85rem' }} />
                    </div>
                    {/* Points + Deadline + Mode */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[#3D3D3D] mb-1.5 block" style={{ fontSize: '0.83rem', fontWeight: 600 }}>النقاط</label>
                        <input type="number" value={taskForm.points} onChange={e => setTF('points', e.target.value)} placeholder="5"
                          className="w-full bg-white rounded-2xl px-3 py-2.5 outline-none text-[#1C1C1C] border border-[#E8DDD4]" style={{ fontSize: '0.85rem' }} />
                      </div>
                      <div className="flex-1">
                        <label className="text-[#3D3D3D] mb-1.5 block" style={{ fontSize: '0.83rem', fontWeight: 600 }}>الموعد</label>
                        <input type="date" value={taskForm.toDate} onChange={e => setTF('toDate', e.target.value)}
                          className="w-full bg-white rounded-2xl px-3 py-2.5 outline-none text-[#1C1C1C] border border-[#E8DDD4]" style={{ fontSize: '0.82rem', direction: 'ltr' }} />
                      </div>
                    </div>
                    {/* Points mode */}
                    <div>
                      <label className="text-[#3D3D3D] mb-1.5 block" style={{ fontSize: '0.83rem', fontWeight: 600 }}>إضافة النقاط</label>
                      <div className="flex gap-2">
                        {([['auto', 'تلقائي عند الإرسال'], ['manual', 'يدوي بعد تقييمي']] as const).map(([val, label]) => (
                          <button key={val} onClick={() => setTF('pointsMode', val)}
                            className={`flex-1 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-1 ${taskForm.pointsMode === val ? 'bg-[#014761] border-[#014761] text-white' : 'bg-white border-[#A8DFD0] text-[#3D3D3D]'}`}
                            style={{ fontSize: '0.75rem', fontWeight: taskForm.pointsMode === val ? 600 : 400 }}>
                            {val === 'auto' ? <Zap size={11} /> : <UserCheck size={11} />}
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleSaveTask} disabled={!taskForm.title.trim() || !taskForm.type || !taskForm.description.trim()}
                      className="w-full py-3 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}>
                      <Check size={15} />
                      {editingTaskId ? 'حفظ التعديلات' : 'إضافة المهمة للحدث'}
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={openAddTask}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-[#014761]/30 text-[#014761] flex items-center justify-center gap-2"
                  style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  <Plus size={16} />إضافة مهمة للحدث
                </button>
              )}

              {eventTasks.length === 0 && !showTaskForm && (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckSquare size={36} color="#C4C4C4" />
                  <p className="text-[#9A9A9A] mt-2" style={{ fontSize: '0.85rem' }}>لا توجد مهام مرتبطة بهذا الحدث بعد</p>
                </div>
              )}

              {eventTasks.map((task) => {
                const isDeleting = deletingTaskId === task.id;
                return (
                  <div key={task.id} className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 2px 8px rgba(1, 71, 97, 0.07)' }}>
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <TypeIcon type={task.type} size={15} />
                        <span className="px-2 py-0.5 rounded-lg bg-[#014761]/10 text-[#014761]" style={{ fontSize: '0.65rem', fontWeight: 600 }}>{task.type}</span>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                          style={{ background: task.createdBy === 'admin' ? '#7C3AED18' : '#01476118', fontSize: '0.65rem', fontWeight: 600, color: task.createdBy === 'admin' ? '#7C3AED' : '#014761' }}>
                          <Shield size={8} />{task.createdBy === 'admin' ? 'أمين الخدمة' : 'خادم'}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#16A34A]" style={{ fontSize: '0.73rem', fontWeight: 700 }}>+{task.points}نقاط</span>
                        <button onClick={() => openEditTask(task)} className="w-7 h-7 rounded-xl bg-[#014761]/10 flex items-center justify-center"><Pencil size={12} color="#014761" /></button>
                        <button onClick={() => setDeletingTaskId(task.id)} className="w-7 h-7 rounded-xl bg-[#DC2626]/10 flex items-center justify-center"><Trash2 size={12} color="#DC2626" /></button>
                      </div>
                    </div>
                    <p className="text-[#1C1C1C] mb-1" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{task.title}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#7A7A7A]" style={{ fontSize: '0.73rem' }}>الموعد: {task.deadline} •</span>
                      <TaskStatusBadge status={task.status} />
                    </div>
                    {isDeleting && (
                      <div className="flex items-center gap-2 bg-[#DC2626]/8 rounded-xl px-3 py-2.5">
                        <span className="text-[#DC2626] flex-1" style={{ fontSize: '0.78rem', fontWeight: 600 }}>حذف هذه المهمة؟</span>
                        <button onClick={() => handleDeleteTask(task.id)} className="px-3 py-1.5 rounded-xl bg-[#DC2626] text-white" style={{ fontSize: '0.73rem', fontWeight: 700 }}>حذف</button>
                        <button onClick={() => setDeletingTaskId(null)} className="px-3 py-1.5 rounded-xl bg-[#F2F3F2] text-[#4A4A4A]" style={{ fontSize: '0.73rem', fontWeight: 600 }}>إلغاء</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal - Multi-Step */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full bg-white rounded-t-[2rem] max-h-[85vh] overflow-y-auto">
            {/* Step Indicator */}
            <div className="sticky top-0 bg-white px-5 pt-5 pb-4 border-b border-[#F0EBE3]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StepHeaderIcon step={step} />
                  <h2 className="text-[#1C1C1C]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    {stepTitle(step)}
                  </h2>
                </div>
                <button onClick={() => setShowAdd(false)}>
                  <X size={20} color="#4A4A4A" />
                </button>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-[#014761]' : 'bg-[#C8EDE5]'}`} />
                ))}
              </div>
              <p className="text-[#9A9A9A] mt-1" style={{ fontSize: '0.72rem' }}>خطوة {step} من 3</p>
            </div>

            <div className="px-5 pt-4 pb-6">
              {/* ── STEP 1: Basic info + program ── */}
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  {/* Title */}
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>عنوان الحدث *</label>
                    <input value={eventForm.title} onChange={e => setEF('title', e.target.value)} placeholder="اجتماع الجمعة الأسبوعي"
                      className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]" style={{ fontSize: '0.88rem' }} />
                  </div>
                  {/* Type */}
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>نوع الحدث</label>
                    <div className="flex gap-2 flex-wrap">
                      {['اجتماع', 'رحلة', 'خدمة', 'أخرى'].map((t) => (
                        <button key={t} onClick={() => setEF('eventType', t)}
                          className={`px-3 py-2 rounded-xl border transition-all ${eventForm.eventType === t ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                          style={{ fontSize: '0.82rem', fontWeight: eventForm.eventType === t ? 600 : 400 }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  {/* Dates */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>تاريخ البداية *</label>
                      <input type="date" value={eventForm.startDate} onChange={e => setEF('startDate', e.target.value)}
                        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none" style={{ fontSize: '0.88rem', direction: 'ltr' }} />
                    </div>
                    <div className="flex-1">
                      <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>وقت البداية *</label>
                      <input type="time" value={eventForm.startTime} onChange={e => setEF('startTime', e.target.value)}
                        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none" style={{ fontSize: '0.88rem', direction: 'ltr' }} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>تاريخ النهاية</label>
                      <input type="date" value={eventForm.endDate} onChange={e => setEF('endDate', e.target.value)}
                        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none" style={{ fontSize: '0.88rem', direction: 'ltr' }} />
                    </div>
                    <div className="flex-1">
                      <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>وقت النهاية</label>
                      <input type="time" value={eventForm.endTime} onChange={e => setEF('endTime', e.target.value)}
                        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none" style={{ fontSize: '0.88rem', direction: 'ltr' }} />
                    </div>
                  </div>
                  {/* Location */}
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>المكان *</label>
                    <input value={eventForm.location} onChange={e => setEF('location', e.target.value)} placeholder="الكنيسة الجديدة، الدقي"
                      className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]" style={{ fontSize: '0.88rem' }} />
                  </div>

                  {/* Program Builder */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[#3D3D3D]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>برنامج الحدث</label>
                      <button
                        onClick={() => setEF('program', [...eventForm.program, { time: '', activity: '', notes: '' }])}
                        className="flex items-center gap-1 text-[#014761]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                        <Plus size={13} />إضافة فقرة
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {eventForm.program.map((item, i) => (
                        <div key={i} className="bg-[#F2F3F2] rounded-2xl p-3 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[#014761] w-5 text-center" style={{ fontSize: '0.78rem', fontWeight: 700 }}>{i + 1}</span>
                            <input value={item.time} onChange={e => { const p = [...eventForm.program]; p[i].time = e.target.value; setEF('program', p); }}
                              placeholder="الوقت (مثال: 6:00)" className="w-24 bg-white rounded-xl px-3 py-2 outline-none text-[#1C1C1C]"
                              style={{ fontSize: '0.8rem', direction: 'ltr' }} />
                            <input value={item.activity} onChange={e => { const p = [...eventForm.program]; p[i].activity = e.target.value; setEF('program', p); }}
                              placeholder="اسم الفقرة" className="flex-1 bg-white rounded-xl px-3 py-2 outline-none text-[#1C1C1C]"
                              style={{ fontSize: '0.8rem' }} />
                            {eventForm.program.length > 1 && (
                              <button onClick={() => setEF('program', eventForm.program.filter((_, j) => j !== i))}
                                className="w-7 h-7 rounded-lg bg-[#DC2626]/10 flex items-center justify-center shrink-0">
                                <X size={12} color="#DC2626" />
                              </button>
                            )}
                          </div>
                          <input value={item.notes} onChange={e => { const p = [...eventForm.program]; p[i].notes = e.target.value; setEF('program', p); }}
                            placeholder="ملاحظات / تعليمات (اختياري)" className="w-full bg-white rounded-xl px-3 py-2 outline-none text-[#1C1C1C]"
                            style={{ fontSize: '0.78rem' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Details + alerts ── */}
              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>الوصف التفصيلي</label>
                    <textarea rows={3} value={eventForm.description} onChange={e => setEF('description', e.target.value)}
                      placeholder="اكتب وصف الحدث..." className="w-full bg-[#F2F3F2] rounded-2xl p-3 outline-none resize-none"
                      style={{ fontSize: '0.88rem' }} />
                  </div>
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>الاشتراك</label>
                    <div className="flex gap-2">
                      {(['مجاني', 'مدفوع'] as const).map((t) => (
                        <button key={t} onClick={() => setEF('paid', t)}
                          className={`flex-1 py-3 rounded-2xl border transition-all ${eventForm.paid === t ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                          style={{ fontSize: '0.85rem', fontWeight: eventForm.paid === t ? 700 : 400 }}>{t}</button>
                      ))}
                    </div>
                    {eventForm.paid === 'مدفوع' && (
                      <input value={eventForm.price} onChange={e => setEF('price', e.target.value)} placeholder="السعر بالجنيه" type="number"
                        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none mt-2" style={{ fontSize: '0.88rem' }} />
                    )}
                  </div>
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>المدعوون</label>
                    <div className="flex gap-2">
                      {['الكل', 'مجموعات', 'أفراد'].map((t) => (
                        <button key={t} onClick={() => setEF('invitees', t)}
                          className={`flex-1 py-2.5 rounded-xl border transition-all ${eventForm.invitees === t ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                          style={{ fontSize: '0.8rem', fontWeight: eventForm.invitees === t ? 600 : 400 }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>حالة التسجيل</label>
                    <div className="flex gap-2">
                      {['مفتوح', 'قابل للحجز', 'محجوز'].map((t) => (
                        <button key={t} onClick={() => setEF('regStatus', t)}
                          className={`flex-1 py-2.5 rounded-xl border transition-all ${eventForm.regStatus === t ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                          style={{ fontSize: '0.75rem', fontWeight: eventForm.regStatus === t ? 600 : 400 }}>{t}</button>
                      ))}
                    </div>
                  </div>

                  {/* Alerts */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[#3D3D3D]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>تنبيهات الحدث</label>
                      <button onClick={() => setEF('alerts', [...eventForm.alerts, ''])}
                        className="flex items-center gap-1 text-[#014761]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                        <Plus size={13} />إضافة تنبيه
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {eventForm.alerts.map((alert, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input value={alert} onChange={e => { const a = [...eventForm.alerts]; a[i] = e.target.value; setEF('alerts', a); }}
                            placeholder={`تنبيه ${i + 1} (مثال: أحضر كتابك المقدس)`}
                            className="flex-1 bg-[#F2F3F2] rounded-2xl px-4 py-2.5 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                            style={{ fontSize: '0.85rem' }} />
                          {eventForm.alerts.length > 1 && (
                            <button onClick={() => setEF('alerts', eventForm.alerts.filter((_, j) => j !== i))}
                              className="w-8 h-8 rounded-xl bg-[#DC2626]/10 flex items-center justify-center shrink-0">
                              <X size={14} color="#DC2626" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Media + summary + notify ── */}
              {step === 3 && (
                <div className="flex flex-col gap-5">
                  {/* Photos */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[#3D3D3D]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        صور الحدث
                        <span className="text-[#9A9A9A] mr-1" style={{ fontSize: '0.73rem', fontWeight: 400 }}>({eventForm.photos.length}/10)</span>
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {eventForm.photos.map((p, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-2xl bg-[#014761]/15 flex items-center justify-center">
                          <Image size={22} color="#014761" />
                          <button onClick={() => setEF('photos', eventForm.photos.filter((_, j) => j !== i))}
                            className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#DC2626] flex items-center justify-center">
                            <X size={10} color="white" />
                          </button>
                        </div>
                      ))}
                      {eventForm.photos.length < 10 && (
                        <button onClick={() => setEF('photos', [...eventForm.photos, `photo${eventForm.photos.length + 1}`])}
                          className="w-20 h-20 rounded-2xl bg-[#F2F3F2] border-2 border-dashed border-[#A8DFD0] flex flex-col items-center justify-center gap-1">
                          <Plus size={18} color="#C4C4C4" />
                          <span className="text-[#C4C4C4]" style={{ fontSize: '0.62rem' }}>إضافة</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Audio */}
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>ملف صوتي / بودكاست</label>
                    {eventForm.audioName ? (
                      <div className="flex items-center gap-3 bg-[#014761]/8 rounded-2xl px-4 py-3">
                        <div className="w-9 h-9 rounded-xl bg-[#014761] flex items-center justify-center shrink-0">
                          <Headphones size={16} color="white" />
                        </div>
                        <span className="flex-1 text-[#1C1C1C]" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{eventForm.audioName}</span>
                        <button onClick={() => setEF('audioName', '')} className="w-7 h-7 rounded-lg bg-[#DC2626]/10 flex items-center justify-center">
                          <X size={13} color="#DC2626" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setEF('audioName', 'ملخص_الاجتماع.mp3')}
                        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#A8DFD0] flex items-center justify-center gap-2 text-[#7A7A7A]"
                        style={{ fontSize: '0.85rem' }}>
                        <Headphones size={16} />رفع ملف صوتي (MP3)
                      </button>
                    )}
                  </div>

                  {/* Text Summary */}
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      ملخص نصي
                      <span className="text-[#9A9A9A] mr-1" style={{ fontSize: '0.73rem', fontWeight: 400 }}>(اختياري)</span>
                    </label>
                    <textarea rows={3} value={eventForm.textSummary} onChange={e => setEF('textSummary', e.target.value)}
                      placeholder="اكتب ملخصاً للحدث يظهر للمخدومين..."
                      className="w-full bg-[#F2F3F2] rounded-2xl p-3 outline-none resize-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
                      style={{ fontSize: '0.88rem' }} />
                  </div>

                  {/* Notify */}
                  <div>
                    <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>إرسال الإشعار للمدعوين</label>
                    <div className="flex gap-2">
                      {['الآن', 'جدولة'].map((t) => (
                        <button key={t} onClick={() => setEF('notifyWhen', t)}
                          className={`flex-1 py-3 rounded-2xl border transition-all ${eventForm.notifyWhen === t ? 'bg-[#014761] border-[#014761] text-white' : 'bg-[#F2F3F2] border-[#A8DFD0] text-[#3D3D3D]'}`}
                          style={{ fontSize: '0.85rem', fontWeight: eventForm.notifyWhen === t ? 700 : 400 }}>{t}</button>
                      ))}
                    </div>
                    {eventForm.notifyWhen === 'جدولة' && (
                      <input type="datetime-local" className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none mt-2"
                        style={{ fontSize: '0.85rem', direction: 'ltr' }} />
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <button onClick={() => setStep((s) => (s - 1) as Step)} className="flex-1 py-3.5 rounded-2xl border border-[#E8DDD4] flex items-center justify-center gap-2 text-[#4A4A4A]"
                    style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    <ChevronRight size={16} />
                    السابق
                  </button>
                )}
                <button
                  onClick={() => {
                    if (step < 3) setStep((s) => (s + 1) as Step);
                    else setShowAdd(false);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-[#014761] text-white flex items-center justify-center gap-2"
                  style={{ fontSize: '0.88rem', fontWeight: 700, boxShadow: '0 4px 14px rgba(1, 71, 97, 0.3)' }}
                >
                  {step === 3 ? 'نشر الحدث' : 'التالي'}
                  {step < 3 && <ChevronLeft size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-[#3D3D3D] mb-2 block" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-[#F2F3F2] rounded-2xl px-4 py-3 outline-none text-[#1C1C1C] placeholder:text-[#C4C4C4]"
        style={{ fontSize: '0.88rem' }}
      />
    </div>
  );
}
