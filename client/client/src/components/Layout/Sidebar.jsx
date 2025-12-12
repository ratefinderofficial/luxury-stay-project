import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarDays, 
  Users, 
  ClipboardList, 
  Wrench, 
  Receipt, 
  BarChart3, 
  Settings, 
  LogOut,
  MessageSquare // 👈 Yeh naya icon import kiya hai
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <CalendarDays size={20} />, label: 'Bookings', path: '/bookings' },
   { icon: <BedDouble size={20} />, label: 'Rooms', path: '/admin/rooms', roles: ['admin', 'manager', 'receptionist'] },
    { icon: <Users size={20} />, label: 'Guests', path: '/guests' }, 
    
    { icon: <ClipboardList size={20} />, label: 'Housekeeping', path: '/housekeeping' },
   
    { icon: <Wrench size={20} />, label: 'Maintenance', path: '/maintenance' },
    { icon: <Receipt size={20} />, label: 'Billing', path: '/billing' },
    { icon: <BarChart3 size={20} />, label: 'Reports', path: '/reports' },
    
    // 👇 Yahan Icon Change kiya hai (BarChart3 -> MessageSquare)
    { icon: <MessageSquare size={20} />, label: 'Feedback', path: '/feedback' }, 
    
    ...(user?.role === 'admin' ? [{ icon: <Settings size={20} />, label: 'Settings', path: '/settings' }] : []),
  ];

  return (
    // ... baaki code same rahega ...
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-primary text-white shadow-xl z-50">
      {/* Brand Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-blue-800 bg-primary-dark">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center font-bold text-white">LS</div>
            <span className="text-xl font-bold tracking-wide">LuxuryStay</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 
                ${isActive 
                  ? 'bg-blue-700 text-white shadow-md translate-x-1' 
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-blue-800 bg-primary-dark">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Staff Member'}</p>
            <p className="text-xs text-blue-300 truncate capitalize">{user?.role || 'Employee'}</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-200 hover:bg-red-900/30 hover:text-red-100 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;