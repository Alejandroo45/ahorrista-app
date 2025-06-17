import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Checking stored credentials');
    
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    
    console.log('🔍 Stored credentials:', {
      tokenExists: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
      email: email || 'none'
    });
    
    if (token && email) {
      console.log(' Valid credentials found, setting user as authenticated');
      setUser({ token, email });
    } else {
      console.log(' No valid credentials found');
    }
    
    setLoading(false);
  }, []);

  const login = (token: string, email: string) => {
    console.log('🔐 AuthProvider: Logging in user', {
      email,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...'
    });
    
    // Limpiar cualquier token anterior
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    
    // Guardar nuevos datos
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    
    // Verificar que se guardó correctamente
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    
    console.log('🔍 Verification after save:', {
      tokenSaved: savedToken === token,
      emailSaved: savedEmail === email,
      savedTokenLength: savedToken?.length,
      savedEmail
    });
    
    setUser({ token, email });
    console.log('✅ User logged in successfully');
  };

  const logout = () => {
    console.log('🔐 AuthProvider: Logging out user');
    
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
    
    console.log('✅ User logged out successfully');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  console.log('🔐 AuthProvider state:', {
    isAuthenticated: !!user,
    loading,
    userEmail: user?.email,
    hasToken: !!user?.token
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export {};