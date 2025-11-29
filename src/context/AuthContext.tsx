import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al iniciar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing user data", e);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    // Simular API
    return new Promise((resolve) => {
      setTimeout(() => {
        if ((emailOrUsername === 'admin' && password === 'admin') || (emailOrUsername && password.length >= 6)) {
          const mockUser: User = {
            id: '1',
            name: emailOrUsername === 'admin' ? 'Administrador' : 'Usuario Demo',
            email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@cardtrader.com`,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            isOnline: true
          };
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (name && email && password.length >= 6) {
          const mockUser: User = {
            id: Date.now().toString(),
            name,
            email,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            isOnline: true
          };
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};