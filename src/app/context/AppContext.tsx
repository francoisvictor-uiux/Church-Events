import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

const AppContext = createContext<AppContextType>({
  role: 'makhdom',
  setRole: () => {},
  currentScreen: 'home',
  setCurrentScreen: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('makhdom');
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <AppContext.Provider value={{ role, setRole, currentScreen, setCurrentScreen }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
