import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginData } from '../types';
import apiService from '../services/apiService';

interface AuthContextType {
  user: User | null;
  login: (loginData: LoginData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Vérifier la validité du token
          const response = await apiService.verifyToken();
          if (response.success && response.data) {
            setUser(response.data.user);
          } else {
            // Token invalide, nettoyer le localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (loginData: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiService.login(loginData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Sauvegarder dans le localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        return true;
      } else {
        console.error('Erreur lors de la connexion:', response.message);
        return false;
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error.response?.data?.message || error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};