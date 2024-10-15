import { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { AuthContextType, User } from '../entities';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Get API base URL from the environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, { username, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      setUser({ username, role });
      setLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
    }
  };

  // Register function (Signup)
  const register = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/signup`, {
        username,
        password,
      });
      console.log('User registered:', response.data);  // Log response for debugging
      setLoading(false);
    } catch (error) {
        console.error('Signup failed:', error);
      alert('Failed to register. Please try again.');
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);  // Reset user state
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
