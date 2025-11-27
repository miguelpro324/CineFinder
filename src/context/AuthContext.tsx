import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { localStorageService, STORAGE_KEYS } from '../services/localStorage.service';

interface AuthContextType {
  username: string | null;
  userId: string | null;
  login: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedUsername = localStorageService.getString(STORAGE_KEYS.CURRENT_USER);
    const savedUserId = localStorageService.getString(STORAGE_KEYS.CURRENT_USER_ID);
    if (savedUsername) {
      setUsername(savedUsername);
      setUserId(savedUserId || savedUsername);
    }
  }, []);

  const login = (user: string) => {
    setUsername(user);
    setUserId(user);
    localStorageService.setString(STORAGE_KEYS.CURRENT_USER, user);
    localStorageService.setString(STORAGE_KEYS.CURRENT_USER_ID, user);
  };

  const logout = () => {
    setUsername(null);
    setUserId(null);
    localStorageService.remove(STORAGE_KEYS.CURRENT_USER);
    localStorageService.remove(STORAGE_KEYS.CURRENT_USER_ID);
  };

  const isAuthenticated = username !== null;

  return (
    <AuthContext.Provider value={{ username, userId, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
