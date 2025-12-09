import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/mockAPI';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('oncoscan_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authAPI.login(email, password);
      setUser(userData);
      localStorage.setItem('oncoscan_user', JSON.stringify(userData));
      
      // Redirect based on role
      if (userData.role === 'patient') {
        navigate('/patient/portal');
      } else {
        navigate('/dashboard');
      }
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const newUser = await authAPI.signup(userData);
      setUser(newUser);
      localStorage.setItem('oncoscan_user', JSON.stringify(newUser));
      
      // Redirect based on role
      if (newUser.role === 'patient') {
        navigate('/patient/portal');
      } else {
        navigate('/dashboard');
      }
      
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oncoscan_user');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
