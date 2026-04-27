import { useState } from 'react';
import { Calendar, CheckCircle2, Trophy, MessageSquare, Bell } from 'lucide-react';
import { notifications, Notification } from '../../data/mockData';

type Tab = 'الكل' | 'أحداث' | 'مهام' | 'نقاط';

const TypeIcon = ({ type, size = 20, color }: { type: Notification['type']; size?: number; color: string }) => {
  if (type === 'event') return <Calendar size={size} color={color} />;
  if (type === 'task') return <CheckCircle2 size={size} color={color} />;
  if (type === 'points') return <Trophy size={size} color={color} />;
  return <MessageSquare size={size} color={color} />;
};

const typeFilter = (n: Notification, tab: Tab) => {
  if (tab === 'الكل') return true;
  if (tab === 'أحداث') return n.type === 'event';
  if (tab === 'مهام') return n.type === 'task';
  if (tab === 'نقاط') return n.type === 'points';
  return true;
};

export function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('الكل');
  const [items, setItems] = useState(notifications);

  const filtered = items.filter((n) => typeFilter(n, activeTab));

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex flex-col min-h-full pb-4">
      {/* Header */}
      <div className="bg-[#014761] px-5 pt-14 pb-5 rounded-b-[2rem]" style={{ boxShadow: '0 8px 24px rgba(1, 71, 97, 0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white" style={{ fontSize: '1.3rem', fontWeight: 700 }}>الإشعارات</h1>
          <button onClick={markAllRead} className="text-white/80" style={{ fontSize: '0.8rem' }}>قراءة الكل</button>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {(['الكل', 'أحداث', 'مهام', 'نقاط'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${activeTab === tab ? 'bg-white text-[#014761]' : 'bg-white/15 text-white'}`}
              style={{ fontSize: '0.82rem', fontWeight: activeTab === tab ? 700 : 500 }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-3">
        {filtered.map((notification) => {
          const iconColor = !notification.read ? '#014761' : '#9A9A9A';
          return (
            <div
              key={notification.id}
              className={`bg-white rounded-3xl p-4 flex gap-3 ${!notification.read ? 'border-r-4 border-[#014761]' : ''}`}
              style={{ boxShadow: '0 4px 16px rgba(1, 71, 97, 0.07)' }}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                !notification.read ? 'bg-[#014761]/10' : 'bg-[#F2F3F2]'
              }`}>
                <TypeIcon type={notification.type} size={20} color={iconColor} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`${notification.read ? 'text-[#3D3D3D]' : 'text-[#1C1C1C]'}`}
                    style={{ fontSize: '0.85rem', fontWeight: notification.read ? 500 : 700 }}
                  >
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-[#014761] mt-1.5 shrink-0" />
                  )}
                </div>
                <p className="text-[#7A7A7A] mt-0.5" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                  {notification.body}
                </p>
                <p className="text-[#C4C4C4] mt-1.5" style={{ fontSize: '0.72rem' }}>{notification.time}</p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <Bell size={48} color="#A8DFD0" />
            <p className="text-[#7A7A7A] mt-3" style={{ fontSize: '0.9rem' }}>لا توجد إشعارات</p>
          </div>
        )}
      </div>
    </div>
  );
}