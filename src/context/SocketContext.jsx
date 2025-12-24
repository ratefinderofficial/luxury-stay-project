import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // 🛠️ IMPORTANT FIX: 
    // Check karein ke User aur User._id waqai mein exist karte hain ya nahi
    // Agar user._id nahi hai, toh connect mat karo.
    if (isAuthenticated && user && user._id) {
      
      // Backend URL extract logic
      const socketUrl = import.meta.env.VITE_API_BASE_URL.split('/api')[0];
      
      const newSocket = io(socketUrl, {
        query: {
          userId: user._id, // Ab ye undefined nahi hoga
          role: user.role
        },
        transports: ['websocket'], // Faster connection
        reconnectionAttempts: 5 // Limit retries
      });

      setSocket(newSocket);

      // Listen for connection
      newSocket.on('connect', () => {
        console.log(`🟢 Socket Connected: ${newSocket.id} | User: ${user.name}`);
      });

      newSocket.on('connect_error', (err) => {
        // Error ko ignore karein taake console laal na ho
        // console.warn("Socket connecting..."); 
      });

      // Cleanup: Jab user logout kare ya component unmount ho
      return () => {
        newSocket.disconnect();
        console.log("🔴 Socket Disconnected");
        setSocket(null);
      };
    } 
    
    // Agar user logout ho gaya hai
    else if (!isAuthenticated && socket) {
      socket.disconnect();
      setSocket(null);
    }

  }, [isAuthenticated, user]); // Jab user change ho tab hi run karega

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};