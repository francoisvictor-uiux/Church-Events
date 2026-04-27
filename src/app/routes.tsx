import { createBrowserRouter, Navigate } from 'react-router';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { OTPScreen } from './screens/OTPScreen';

// Makhdom
import { MakhdomLayout } from './screens/makhdom/MakhdomLayout';
import { MakhdomHomeScreen } from './screens/makhdom/HomeScreen';
import { EventsScreen, EventDetailScreen } from './screens/makhdom/EventsScreen';
import { QRScreen } from './screens/makhdom/QRScreen';
import { PointsScreen } from './screens/makhdom/PointsScreen';
import { MakhdomTasksScreen, TaskDetailScreen } from './screens/makhdom/TasksScreen';
import { NotificationsScreen } from './screens/makhdom/NotificationsScreen';
import { ProfileScreen } from './screens/makhdom/ProfileScreen';

// Khadem
import { KhademLayout } from './screens/khadem/KhademLayout';
import { KhademHomeScreen } from './screens/khadem/HomeScreen';
import { MembersScreen, MemberDetailScreen } from './screens/khadem/MembersScreen';
import { AttendanceScreen } from './screens/khadem/AttendanceScreen';
import { KhademTasksScreen } from './screens/khadem/TasksScreen';

// Admin
import { AdminLayout } from './screens/admin/AdminLayout';
import { AdminDashboard } from './screens/admin/DashboardScreen';
import { AdminEventsScreen } from './screens/admin/EventsScreen';
import { FundScreen } from './screens/admin/FundScreen';
import { UsersScreen } from './screens/admin/UsersScreen';
import { PointsSettingsScreen } from './screens/admin/PointsSettingsScreen';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/splash" replace /> },
  { path: '/splash', element: <SplashScreen /> },
  { path: '/onboarding', element: <OnboardingScreen /> },
  { path: '/login', element: <LoginScreen /> },
  { path: '/otp', element: <OTPScreen /> },

  // Makhdom (served member) routes
  {
    path: '/makhdom',
    element: <MakhdomLayout />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: 'home', element: <MakhdomHomeScreen /> },
      { path: 'events', element: <EventsScreen /> },
      { path: 'events/:id', element: <EventDetailScreen /> },
      { path: 'qr', element: <QRScreen /> },
      { path: 'points', element: <PointsScreen /> },
      { path: 'tasks', element: <MakhdomTasksScreen /> },
      { path: 'tasks/:id', element: <TaskDetailScreen /> },
      { path: 'notifications', element: <NotificationsScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
    ],
  },

  // Khadem (servant) routes
  {
    path: '/khadem',
    element: <KhademLayout />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: 'home', element: <KhademHomeScreen /> },
      { path: 'members', element: <MembersScreen /> },
      { path: 'members/:id', element: <MemberDetailScreen /> },
      { path: 'attendance', element: <AttendanceScreen /> },
      { path: 'tasks', element: <KhademTasksScreen /> },
      { path: 'notifications', element: <NotificationsScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'events', element: <AdminEventsScreen /> },
      { path: 'fund', element: <FundScreen /> },
      { path: 'users', element: <UsersScreen /> },
      { path: 'points', element: <PointsSettingsScreen /> },
      { path: 'notifications', element: <NotificationsScreen /> },
    ],
  },
]);
