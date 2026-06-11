import React, { createContext, useCallback, useContext, useState } from 'react';
import { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAdmin: boolean;
  loginAsMock: (role: 'admin' | 'user') => void;
  logout: () => void;
}

const MOCK_ADMIN: AuthUser = {
  id: 'admin-001',
  username: 'Administrador',
  email: 'admin@gamelib.io',
  role: 'admin',
};

const MOCK_USER: AuthUser = {
  id: 'user-001',
  username: 'Jogador',
  email: 'jogador@gamelib.io',
  role: 'user',
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const loginAsMock = useCallback((role: 'admin' | 'user') => {
    setUser(role === 'admin' ? MOCK_ADMIN : MOCK_USER);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === 'admin', loginAsMock, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
