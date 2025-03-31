import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../../shared/types';

interface AuthContextType {
  user: User | null;
  setAuthUser: (userData: User) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  
  const setAuthUser = (userData: User) => {
    // No need to fetch again - we already have the user data
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      setAuthUser,
      isLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 