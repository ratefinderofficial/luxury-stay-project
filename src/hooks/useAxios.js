import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Example Usage:
 * const { execute, loading, error } = useAxios();
 * await execute(roomAPI.getAllRooms);
 */
const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunction(...args);
      
      setData(response);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      
      // Error message extract karna (Backend standard format se)
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      
      // Optional: Auto toast error show karna
      toast.error(message);
      
      throw err; // Component ko bhi error throw karo agar specific handling karni ho
    }
  }, []);

  return { loading, error, data, execute };
};

export default useAxios;