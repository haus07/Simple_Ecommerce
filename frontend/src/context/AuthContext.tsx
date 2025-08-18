// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../axios/axios';
import { useNavigate } from 'react-router-dom';

interface Role{
    id: number
    name:string
}

interface UserInfo {
  id:number
  username:string
  email: string;
  phone: string;
  roles: Role[]
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (accessToken: string) => Promise<void>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
    const isAdmin = user?.roles?.map(role => role.name)
        .includes('admin')
        || false;
    console.log(isAdmin)
    console.log(isAuthenticated)

  const fetchUser = async (accessToken: string) => {
    try {
      const response = await api.get('api/v1/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
        setUser(response.data.userWithoutPassword);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      logout();
      throw error;
    }
  };

  const login = async (accessToken: string) : Promise<UserInfo>=> {
    localStorage.setItem('access_Token', accessToken);
      const response = await api.get('api/v1/users/me', {
        headers:{Authorization:`Bearer ${accessToken}`}
      })
      const userData = response.data.userWithoutPassword
      setUser(userData)
      return userData
      
  };

  const logout = () => {
    localStorage.removeItem('access_Token');
    setUser(null);
    
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('access_Token');
      if (accessToken) {
        try {
          await fetchUser(accessToken);
        } catch (error) {

        }
      }
      setIsLoading(false)
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isLoading, login, logout }}>
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