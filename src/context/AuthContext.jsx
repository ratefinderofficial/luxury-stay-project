import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/authAPI';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Debugging Check
          if (!parsedUser.role) {
            console.error("⚠️ Found user in storage but NO ROLE. Logging out...");
            logout();
            setLoading(false);
            return;
          }
          
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Auth Data Corrupt", e);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      
      // CRITICAL CHECK: Backend se role aa raha hai ya nahi?
      console.log("Login Response from Server:", data); 

      if (!data.user || !data.user.role) {
        return { success: false, message: "Login successful but Role missing from server!" };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    // window.location.href = '/login'; // Optional: Force reload
  };

  const updateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem('user', JSON.stringify(updatedData));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      updateUser 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};