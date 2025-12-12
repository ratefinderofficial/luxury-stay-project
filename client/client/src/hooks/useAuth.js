import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  // Debugging check: Developer ko batane ke liye agar wo Provider lagana bhool gaya
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;