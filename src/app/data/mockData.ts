export type UserRole = 'makhdom' | 'khadem' | 'admin';

export interface Member {
  id: string;
  name: string;
  phone: string;
  points: number;
  streak: number;
  lastAttendance: string;
  totalAttendance: number;
  totalMeetings: number;
  status: 'active' | 'warning' | 'inactive';
  group: string;
  avatar: string;
  daysAbsent?: number;
  role?: 'makhdom' | 'khadem';
  servantName?: string;
  nationalId?: string;
  governorate?: string;
  city?: string;
  district?: string;
  street?: string;
  birthDate?: string;
  batch?: string;
  faculty?: string;
  job?: string;
  maritalStatus?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  type: 'اجتماع' | 'رحلة' | 'خدمة' | 'أخرى';
  status: 'upcoming' | 'past' | 'active';
  paid: boolean;
  price?: number;
  committed: number;
  total: number;
  description: string;
  attended?: boolean;
  attendedPoints?: number;
  program: { time: string; activity: string; notes?: string }[];
  images?: string[];
  registrationStatus: 'مفتوح' | 'محجوز' | 'قابل للحجز';
  myStatus?: 'committed' | 'not_committed' | 'absent' | null;
  photos?: string[];
  audioUrl?: string;
  audioDuration?: string;
  textSummary?: string;
  alerts?: string[];
}

export interface PointsSettings {
  conversionRate: number;
  attendancePoints: number;
  tripPoints: number;
  taskPoints: number;
  spiritualTaskPoints: number;
  streakBonus2Weeks: number;
  streakBonus1Month: number;
  firstAttendancePoints: number;
  groupBonusPoints: number;
}

export interface HomeContent {
  verse: { text: string; reference: string };
  topic: { title: string; body: string };
  announcements: { id: string; title: string; body: string; type: 'job' | 'announcement' | 'news' }[];
}

export interface PastoralRequest {
  id: string;
  type: 'دعم نفسي' | 'طلب زيارة' | 'مقترح' | 'شكوى';
  description: string;
  privacy: 'سري' | 'عادي';
  status: 'pending' | 'seen' | 'closed';
  date: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'روحية' | 'قراءة' | 'مسابقة' | 'استبيان' | 'أخرى';
  description: string;
  from: string;
  deadline: string;
  points: number;
  status: 'new' | 'in_progress' | 'done' | 'rejected';
  assignedTo?: string;
  submittedAt?: string;
  inputType: 'text' | 'choice' | 'image' | 'link';
  choices?: string[];
  periodic: 'once' | 'weekly' | 'monthly';
  eventId?: string;
  createdBy: 'khadem' | 'admin';
}

export interface Notification {
  id: string;
  type: 'event' | 'task' | 'points' | 'message';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface PointTransaction {
  id: string;
  type: 'حضور' | 'مهمة' | 'مكافأة' | 'خصم' | 'صرف';
  operation: 'add' | 'subtract' | 'spend';
  points: number;
  reason: string;
  date: string;
}

export interface FundTransaction {
  id: string;
  type: 'تبرع' | 'رسوم حدث' | 'أجرة' | 'طعام' | 'طباعة' | 'مستلزمات' | 'أخرى';
  direction: 'in' | 'out';
  amount: number;
  relatedEvent?: string;
  approvedBy: string;
  date: string;
  notes?: string;
}

export const currentUser = {
  makhdom: {
    id: 'u1',
    name: 'ريم جرجس',
    phone: '01012345678',
    role: 'makhdom' as UserRole,
    servant: 'مريم جورج',
    points: 234,
    level: 'نشيط',
    streak: 4,
    rank: 3,
    avatar: 'ر',
    totalAttendance: 45,
    totalMeetings: 60,
    monthAttendance: 8,
    monthMeetings: 10,
    longestStreak: 4,
    monetaryValue: 23.4,
    joinYear: 2023,
  },
  khadem: {
    id: 'k1',
    name: 'مريم جورج',
    phone: '01098765432',
    role: 'khadem' as UserRole,
    points: 450,
    level: 'قائد',
    streak: 8,
    rank: 1,
    avatar: 'م',
    membersCount: 15,
    presentFriday: 12,
    absentFriday: 3,
    newTasks: 2,
  },
  admin: {
    id: 'a1',
    name: 'بطرس رمزي',
    phone: '01155443322',
    role: 'admin' as UserRole,
    points: 0,
    level: 'أمين',
    streak: 0,
    rank: 0,
    avatar: 'ب',
    totalMembers: 78,
    attendanceRate: 82,
    totalEvents: 12,
    fundBalance: 5200,
  },
};

export const members: Member[] = [
  { id: 'm1', name: 'ريم جرجس', phone: '01012345678', points: 234, streak: 4, lastAttendance: 'الجمعة', totalAttendance: 45, totalMeetings: 60, status: 'active', group: '', avatar: 'ر' },
  { id: 'm2', name: 'سارة بولس', phone: '01023456789', points: 298, streak: 6, lastAttendance: 'الجمعة', totalAttendance: 52, totalMeetings: 60, status: 'active', group: '', avatar: 'س' },
  { id: 'm3', name: 'مينا رامي', phone: '01034567890', points: 120, streak: 0, lastAttendance: 'منذ 21 يوم', totalAttendance: 18, totalMeetings: 30, status: 'warning', group: '', avatar: 'م', daysAbsent: 21 },
  { id: 'm4', name: 'مريم فرج', phone: '01045678901', points: 180, streak: 3, lastAttendance: 'الجمعة', totalAttendance: 30, totalMeetings: 45, status: 'active', group: '', avatar: 'م' },
  { id: 'm5', name: 'بيتر عصام', phone: '01056789012', points: 180, streak: 0, lastAttendance: 'منذ 14 يوم', totalAttendance: 22, totalMeetings: 40, status: 'warning', group: '', avatar: 'ب', daysAbsent: 14 },
  { id: 'm6', name: 'نانسي كيرلس', phone: '01067890123', points: 210, streak: 5, lastAttendance: 'الجمعة', totalAttendance: 40, totalMeetings: 55, status: 'active', group: '', avatar: 'ن' },
  { id: 'm7', name: 'يوسف ميخائيل', phone: '01078901234', points: 342, streak: 9, lastAttendance: 'الجمعة', totalAttendance: 58, totalMeetings: 60, status: 'active', group: '', avatar: 'ي' },
  { id: 'm8', name: 'كريستين بشاي', phone: '01089012345', points: 156, streak: 2, lastAttendance: 'الإثنين', totalAttendance: 28, totalMeetings: 45, status: 'active', group: '', avatar: 'ك' },
];

export const events: Event[] = [
  {
    id: 'e1',
    title: 'اجتماع الأسبوع',
    date: 'الجمعة 10 يناير 2026',
    endDate: 'الجمعة 10 يناير 2026',
    time: '6:00 مساءً — 9:00 مساءً',
    location: 'الكنيسة الجديدة، الدقي',
    type: 'اجتماع',
    status: 'upcoming',
    paid: false,
    committed: 12,
    total: 15,
    description: 'اجتماع الشباب الأسبوعي مع تأمل روحي وأنشطة جماعية ومناقشة مفتوحة',
    myStatus: 'committed',
    program: [
      { time: '6:00', activity: 'ترانيم وتسبيح', notes: 'كتاب المزامير' },
      { time: '6:30', activity: 'كلمة الخادم', notes: 'موضوع: الإيمان في الضيق' },
      { time: '7:00', activity: 'مناقشة الموضوع', notes: 'مجموعات صغيرة' },
      { time: '7:45', activity: 'أنشطة جماعية', notes: 'مسابقة وألعاب' },
    ],
    registrationStatus: 'مفتوح',
    photos: ['photo1', 'photo2', 'photo3'],
    audioDuration: '4:32',
    textSummary: 'ناقشنا في هذا الاجتماع موضوع الإيمان في الضيق وكيف نتمسك بوعود الله في أصعب الأوقات. شاركنا تجارب شخصية وتأملنا في سفر أيوب.',
    alerts: ['لا تنسَ إحضار كتابك المقدس', 'الاجتماع سيبدأ بالضبط الساعة 6'],
  },
  {
    id: 'e2',
    title: 'رحلة بورسعيد',
    date: 'السبت 25 يناير 2026',
    time: '6:00 صباحاً',
    location: 'محطة رمسيس',
    type: 'رحلة',
    status: 'upcoming',
    paid: true,
    price: 150,
    committed: 35,
    total: 50,
    description: 'رحلة ترفيهية وروحية إلى بورسعيد مع برنامج مميز للشباب',
    myStatus: null,
    program: [
      { time: '6:00', activity: 'تجمع ومغادرة', notes: 'من محطة رمسيس' },
      { time: '9:00', activity: 'الوصول وترانيم', notes: '' },
      { time: '10:00', activity: 'أنشطة على الشاطئ', notes: '' },
      { time: '2:00', activity: 'غداء وراحة', notes: '' },
      { time: '5:00', activity: 'العودة', notes: '' },
    ],
    registrationStatus: 'محجوز',
  },
  {
    id: 'e3',
    title: 'اجتماع الشباب',
    date: 'الجمعة 1 فبراير 2026',
    time: '7:00 مساءً',
    location: 'قاعة الاجتماعات',
    type: 'اجتماع',
    status: 'upcoming',
    paid: false,
    committed: 8,
    total: 15,
    description: 'اجتماع شبابي خاص مع ضيف مميز',
    myStatus: null,
    program: [],
    registrationStatus: 'مفتوح',
  },
  {
    id: 'e4',
    title: 'اجتماع الشباب السابق',
    date: 'الجمعة 3 يناير 2026',
    time: '6:00 مساءً',
    location: 'الكنيسة الجديدة',
    type: 'اجتماع',
    status: 'past',
    paid: false,
    committed: 14,
    total: 15,
    description: 'اجتماع الأسبوع المنتهي',
    attended: false,
    attendedPoints: 0,
    program: [],
    registrationStatus: 'مفتوح',
    myStatus: 'absent',
  },
  {
    id: 'e5',
    title: 'رحلة دير الميمون',
    date: 'الجمعة 5 يناير 2026',
    time: '6:00 صباحاً',
    location: 'دير الميمون',
    type: 'رحلة',
    status: 'past',
    paid: true,
    price: 200,
    committed: 42,
    total: 50,
    description: 'رحلة روحية إلى الدير',
    attended: true,
    attendedPoints: 15,
    program: [],
    registrationStatus: 'مفتوح',
    myStatus: 'committed',
  },
];

export const tasks: Task[] = [
  {
    id: 't1',
    title: 'اقرأ إصحاح 1 من متى',
    type: 'قراءة',
    description: 'اقرأ الإصحاح الأول من إنجيل متى وشارك ما استفدت منه',
    from: 'مريم جورج',
    deadline: 'الجمعة 17 يناير',
    points: 5,
    status: 'new',
    inputType: 'text',
    periodic: 'once',
    createdBy: 'khadem',
  },
  {
    id: 't2',
    title: 'مسابقة الأناجيل الأربعة',
    type: 'مسابقة',
    description: 'أجب على أسئلة المسابقة الخاصة بالأناجيل الأربعة',
    from: 'مريم جورج',
    deadline: 'الأربعاء 15 يناير',
    points: 10,
    status: 'in_progress',
    inputType: 'choice',
    choices: ['متى', 'مرقس', 'لوقا', 'يوحنا'],
    periodic: 'once',
    createdBy: 'khadem',
  },
  {
    id: 't3',
    title: 'استبيان رضا الخدمة',
    type: 'استبيان',
    description: 'أجب على استبيان قصير عن مدى رضاك عن الخدمة هذا الشهر',
    from: 'بطرس رمزي',
    deadline: 'الإثنين 13 يناير',
    points: 3,
    status: 'new',
    inputType: 'choice',
    choices: ['ممتاز', 'جيد جداً', 'جيد', 'يحتاج تحسين'],
    periodic: 'monthly',
    createdBy: 'admin',
  },
  {
    id: 't4',
    title: 'حضور اجتماع الشباب',
    type: 'أخرى',
    description: 'تأكيد حضور اجتماع الشباب الأسبوعي',
    from: 'مريم جورج',
    deadline: 'الجمعة 10 يناير',
    points: 10,
    status: 'done',
    submittedAt: '10 يناير',
    inputType: 'text',
    periodic: 'weekly',
    createdBy: 'khadem',
  },
  {
    id: 't5',
    title: 'صلاة يومية',
    type: 'روحية',
    description: 'سجّل صلواتك اليومية وشارك طلباتك',
    from: 'مريم جورج',
    deadline: 'الجمعة 10 يناير',
    points: 5,
    status: 'done',
    submittedAt: '9 يناير',
    inputType: 'text',
    periodic: 'weekly',
    createdBy: 'khadem',
  },
  {
    id: 't6',
    title: 'تأمل في موضوع الاجتماع',
    type: 'روحية',
    description: 'بعد الاجتماع، اكتب تأملاً قصيراً في موضوع "الإيمان في الضيق" الذي ناقشناه',
    from: 'مريم جورج',
    deadline: 'الإثنين 13 يناير',
    points: 8,
    status: 'new',
    inputType: 'text',
    periodic: 'once',
    eventId: 'e1',
    createdBy: 'khadem',
  },
  {
    id: 't7',
    title: 'استبيان الاجتماع الأسبوعي',
    type: 'استبيان',
    description: 'كيف كان الاجتماع؟ أجب على الأسئلة القصيرة عن تجربتك في الاجتماع الأسبوعي',
    from: 'بطرس رمزي',
    deadline: 'السبت 11 يناير',
    points: 3,
    status: 'new',
    inputType: 'choice',
    choices: ['ممتاز جداً', 'كان جيداً', 'يمكن أفضل', 'لم يعجبني'],
    periodic: 'once',
    eventId: 'e1',
    createdBy: 'admin',
  },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'event', title: 'اجتماع الجمعة بعد 3 ساعات', body: 'لا تنسَ حضور اجتماع الأسبوع اليوم الساعة 6 مساءً في الكنيسة الجديدة', time: 'منذ 10 دقائق', read: false },
  { id: 'n2', type: 'points', title: 'كسبت 10 نقاط على حضورك!', body: 'تم تسجيل حضورك في اجتماع الأسبوع وإضافة 10 نقاط لرصيدك', time: 'منذ 3 ساعات', read: false },
  { id: 'n3', type: 'task', title: 'مهمة جديدة من مريم', body: 'اقرأ إصحاح 1 من متى وشارك ما استفدت منه قبل الجمعة', time: 'أمس', read: true },
  { id: 'n4', type: 'message', title: 'رسالة من مريم جورج', body: 'أعزائي — اجتماع الجمعة سيكون مميزاً هذا الأسبوع، حضوركم مهم جداً', time: 'منذ يومين', read: true },
  { id: 'n5', type: 'points', title: 'مكافأة خاصة!', body: 'أضاف لك الخادم 15 نقطة إضافية مكافأة على تميزك هذا الشهر', time: 'منذ 3 أيام', read: true },
];

export const pointTransactions: PointTransaction[] = [
  { id: 'p1', type: 'حضور', operation: 'add', points: 10, reason: 'حضور اجتماع الجمعة', date: 'الجمعة 10 يناير' },
  { id: 'p2', type: 'مهمة', operation: 'add', points: 5, reason: 'تنفيذ مهمة صلاة يومية', date: 'الثلاثاء 7 يناير' },
  { id: 'p3', type: 'مكافأة', operation: 'add', points: 15, reason: 'مكافأة خاصة من الخادم', date: 'الإثنين 6 يناير' },
  { id: 'p4', type: 'خصم', operation: 'subtract', points: 5, reason: 'غياب متكرر', date: 'السبت 4 يناير' },
  { id: 'p5', type: 'حضور', operation: 'add', points: 15, reason: 'حضور رحلة دير الميمون', date: 'الأح 5 يناير' },
];

export const leaderboard = [
  { rank: 1, name: 'يوسف ميخائيل', points: 342, avatar: 'ي', isMe: false },
  { rank: 2, name: 'سارة بولس', points: 298, avatar: 'س', isMe: false },
  { rank: 3, name: 'ريم جرجس', points: 234, avatar: 'ر', isMe: true },
  { rank: 4, name: 'مينا رامي', points: 201, avatar: 'م', isMe: false },
  { rank: 5, name: 'بيتر عصام', points: 180, avatar: 'ب', isMe: false },
];

export const fundTransactions: FundTransaction[] = [
  { id: 'f1', type: 'تبرع', direction: 'in', amount: 500, approvedBy: 'بطرس رمزي', date: 'أمس', notes: 'تبرع من الخادم مينا' },
  { id: 'f2', type: 'طباعة', direction: 'out', amount: 150, approvedBy: 'بطرس رمزي', date: 'منذ 3 أيام', notes: 'طباعة برامج الرحلة', relatedEvent: 'رحلة بورسعيد' },
  { id: 'f3', type: 'رسوم حدث', direction: 'in', amount: 3000, approvedBy: 'بطرس رمزي', date: 'منذ أسبوع', notes: 'اشتراكات رحلة دير الميمون', relatedEvent: 'رحلة دير الميمون' },
  { id: 'f4', type: 'طعام', direction: 'out', amount: 800, approvedBy: 'بطرس رمزي', date: 'منذ أسبوع', notes: 'وجبات الرحلة', relatedEvent: 'رحلة دير الميمون' },
  { id: 'f5', type: 'أجرة', direction: 'out', amount: 350, approvedBy: '��طرس رمزي', date: 'منذ أسبوعين', notes: 'أجرة أتوبيس' },
];

export const badges = [
  { id: 'b1', icon: 'flame', name: 'Streak', description: '4 أسابيع متتالية', earned: true },
  { id: 'b2', icon: 'gem', name: 'أول رحلة', description: 'حضرت أول رحلة', earned: true },
  { id: 'b3', icon: 'star', name: 'نشيط', description: 'وصلت لمستوى نشيط', earned: true },
  { id: 'b4', icon: 'trophy', name: 'القائد', description: '300 نقطة للفتح', earned: false },
];

export const attendanceHistory = [
  { date: 'اجتماع • 10 يناير', attended: true },
  { date: 'رحلة دير الميمون • 5 يناير', attended: true },
  { date: 'اجتماع • 3 يناير', attended: false },
  { date: 'اجتماع • 27 ديسمبر', attended: true },
  { date: 'اجتماع • 20 ديسمبر', attended: true },
  { date: 'رحلة • 15 ديسمبر', attended: false },
  { date: 'اجتماع • 13 ديسمبر', attended: true },
];

export const weeklyAttendance = [
  { week: 'الأسبوع 1', percentage: 60 },
  { week: 'الأسبوع 2', percentage: 75 },
  { week: 'الأسبوع 3', percentage: 82 },
  { week: 'الأسبوع 4', percentage: 78 },
];

export const pointsSettings: PointsSettings = {
  conversionRate: 10,
  attendancePoints: 10,
  tripPoints: 15,
  taskPoints: 5,
  spiritualTaskPoints: 10,
  streakBonus2Weeks: 5,
  streakBonus1Month: 20,
  firstAttendancePoints: 5,
  groupBonusPoints: 5,
};

export const homeContent: HomeContent = {
  verse: {
    text: 'أنا هو الطريق والحق والحياة. لا يأتي أحد إلى الآب إلا بي',
    reference: 'يوحنا 14: 6',
  },
  topic: {
    title: 'الإيمان في الضيق',
    body: 'كلما زادت التجارب زاد إيماننا وتعلقنا بالله. الضيق لا يأتي ليكسرنا بل ليقوّينا ويجعلنا أكثر قرباً منه.',
  },
  announcements: [
    { id: 'an1', title: 'فرصة عمل — مبرمج React', body: 'شركة تقنية تبحث عن مطور React لديه خبرة سنتان. للتواصل: 01012345678', type: 'job' },
    { id: 'an2', title: 'إعلان هام عن الرحلة', body: 'يرجى تسديد رسوم رحلة بورسعيد قبل الجمعة القادمة', type: 'announcement' },
    { id: 'an3', title: 'مسابقة الكتاب المقدس', body: 'انضم لمسابقة الكتاب المقدس الشهرية وانافس على جوائز قيّمة', type: 'news' },
  ],
};

export const pastoralRequests: PastoralRequest[] = [
  { id: 'pr1', type: 'دعم نفسي', description: 'أمر بضغط في العمل وأحتاج لدعم', privacy: 'سري', status: 'seen', date: 'منذ أسبوع' },
];