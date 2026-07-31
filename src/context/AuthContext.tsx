import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetPassword: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is cached in local storage
    const savedUser = localStorage.getItem('infrasense_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let department = undefined;
    if (role === 'Engineer') department = 'Civil Infrastructure';
    if (role === 'Municipality Officer') department = 'Public Works Dept';

    const loggedUser: User = {
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      department,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`
    };

    setUser(loggedUser);
    localStorage.setItem('infrasense_user', JSON.stringify(loggedUser));
    setIsLoading(false);
    return true;
  };

  const signup = async (name: string, email: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const loggedUser: User = {
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`
    };

    setUser(loggedUser);
    localStorage.setItem('infrasense_user', JSON.stringify(loggedUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('infrasense_user');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Reset link requested for: ${email}`);
    return true;
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return otp === '123456' || otp.length === 6; // Mock verification
  };

  const resetPassword = async (password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log(`Password reset to: ${password}`);
    return true;
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
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword
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
