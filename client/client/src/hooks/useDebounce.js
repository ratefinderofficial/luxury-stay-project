import { useState, useEffect } from 'react';

/**
 * @param {any} value - The value needed to be debounced (e.g., search term)
 * @param {number} delay - Delay in ms (default 500ms)
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. Timer set karo
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. Cleanup: Agar user delay se pehle dobara type kare, to purana timer tod do
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;