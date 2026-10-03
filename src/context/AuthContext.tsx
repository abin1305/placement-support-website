import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loginApi, registerApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: 'student' | 'admin';
  login: (email: string, role: 'student' | 'admin') => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  switchRole: (newRole: 'student' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'prepmatrix-auth-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'student' | 'admin'>('student');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as User;
      if (parsed?.id) {
        setUser(parsed);
        setRole(parsed.role);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const login = async (email: string, targetRole: 'student' | 'admin') => {
    const res = await loginApi(email, targetRole);
    if (res.user) {
      const nextUser = { ...res.user, role: targetRole };
      setUser(nextUser);
      setRole(nextUser.role);
    }
  };

  const register = async (data: Partial<User>) => {
    const res = await registerApi(data);
    if (res.user) {
      const nextUser = { ...res.user, role: data.role || 'student' };
      setUser(nextUser);
      setRole(nextUser.role);
    }
  };

  const logout = () => {
    setUser(null);
    setRole('student');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setRole(updatedUser.role);
  };

  const switchRole = (newRole: 'student' | 'admin') => {
    setRole(newRole);
    if (!user) {
      return;
    }
    setUser({ ...user, role: newRole });
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, updateUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
