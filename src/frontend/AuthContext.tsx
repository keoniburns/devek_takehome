import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../shared/types';

interface AuthContextType {
  user: User | null;
  setUsername: (username: string) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  const setUsername = (username: string) => {
    // This would normally set the full user object
    // but we're keeping the API compatible
    setUser({ username });
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      setUsername,
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