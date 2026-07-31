import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, phone: string, ward: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('infrasense_user_v2');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse cached user:', err);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, role);
      setUser(data);
      localStorage.setItem('infrasense_user_v2', JSON.stringify(data));
    } catch (err) {
      setUser(null);
      localStorage.removeItem('infrasense_user_v2');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, ward: string): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await authApi.signup(name, email, phone, ward);
      setUser(data);
      localStorage.setItem('infrasense_user_v2', JSON.stringify(data));
    } catch (err) {
      setUser(null);
      localStorage.removeItem('infrasense_user_v2');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('infrasense_user_v2');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthProvider;
