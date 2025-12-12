import { createContext, useState, useEffect, useCallback } from 'react';
import useSocket from '../hooks/useSocket';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();
  const { user } = useAuth();

  // 1. Socket se naya notification sunna
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      // List update karo
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Toast popup dikhao (Visual Feedback)
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 border-l-4 border-primary pointer-events-auto`}>
          <div className="bg-blue-100 p-2 rounded-full text-primary">
            <Bell size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">New Notification</p>
            <p className="text-gray-600 text-sm">{notification.message}</p>
          </div>
        </div>
      ), { duration: 4000 });
    };

    // Event Listener: 'notification' event from backend
    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [socket]);

  // 2. Initial Notifications Fetch karna (Mock logic for now, later API)
  useEffect(() => {
    if (user) {
      // Yahan API call aayegi: api.get('/notifications')
      // Abhi ke liye empty rakha hai
      setNotifications([]); 
      setUnreadCount(0);
    }
  }, [user]);

  // 3. Mark as Read logic
  const markAsRead = (id) => {
    setNotifications((prev) => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    // Backend API call here: api.put(`/notifications/${id}/read`)
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
export default NotificationProvider;