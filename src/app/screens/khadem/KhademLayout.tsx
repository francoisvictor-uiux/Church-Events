import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, Users, CheckSquare, ClipboardList, User } from 'lucide-react';

const tabs = [
  { label: 'الرئيسية', icon: Home, path: '/khadem/home' },
  { label: 'مخدوميني', icon: Users, path: '/khadem/members' },
  { label: 'حضور', icon: CheckSquare, path: '/khadem/attendance' },
  { label: 'مهام', icon: ClipboardList, path: '/khadem/tasks' },
  { label: 'حسابي', icon: User, path: '/khadem/profile' },
];

export function KhademLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || (path === '/khadem/home' && location.pathname === '/khadem');

  return (
    <div className="flex flex-col h-full bg-[#F2F3F2]">
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-[#C8EDE5] px-2 py-2" style={{ boxShadow: '0 -4px 20px rgba(1, 71, 97, 0.06)' }}>
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-1 py-1 px-2 rounded-2xl transition-all"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-[#014761]' : 'bg-transparent'}`}>
                  <tab.icon size={20} color={active ? '#ffffff' : '#9A9A9A'} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span style={{ fontSize: '0.62rem', fontWeight: active ? 700 : 500, color: active ? '#014761' : '#9A9A9A' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}