import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Bell, User, LogOut, Settings, 
  ChevronDown, Search, X 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STATES FOR DROPDOWNS ---
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- HANDLERS ---
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/login');
    }
  };

  // Fake Notifications Data
  const notifications = [
    { id: 1, text: "New booking from Ali Khan", time: "2 min ago", unread: true },
    { id: 2, text: "Room 101 cleaning completed", time: "1 hour ago", unread: false },
    { id: 3, text: "Maintenance request: AC Issue", time: "3 hours ago", unread: false },
  ];

  // --- STYLES ---
  const styles = {
    header: {
      height: '80px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    },
    leftSection: { display: 'flex', alignItems: 'center', gap: '20px' },
    menuBtn: { border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' },
    
    // Search Bar
    searchBox: {
      display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', 
      padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0',
      width: '300px'
    },
    input: { border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px' },

    // Right Section
    rightSection: { display: 'flex', alignItems: 'center', gap: '20px' },
    iconBtn: { 
      position: 'relative', border: 'none', background: '#f1f5f9', 
      width: '40px', height: '40px', borderRadius: '50%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      cursor: 'pointer', color: '#475569', transition: '0.2s'
    },
    badge: {
      position: 'absolute', top: -2, right: -2, 
      backgroundColor: '#ef4444', color: 'white', 
      fontSize: '10px', width: '16px', height: '16px', 
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },

    // Profile Section
    profileBox: { 
      display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
      padding: '5px 10px', borderRadius: '8px', transition: '0.2s'
    },
    avatar: { 
      width: '36px', height: '36px', borderRadius: '50%', 
      backgroundColor: '#2563eb', color: 'white', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
    },
    userInfo: { textAlign: 'left', display: 'none', '@media (min-width: 768px)': { display: 'block' } }, // Hide on mobile
    userName: { fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 },
    userRole: { fontSize: '11px', color: '#64748b', margin: 0, textTransform: 'capitalize' },

    // DROPDOWNS (Popup Menus)
    dropdown: {
      position: 'absolute', top: '70px', right: '30px', 
      backgroundColor: 'white', width: '250px', 
      borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
      border: '1px solid #f1f5f9', overflow: 'hidden', animation: 'fadeIn 0.2s'
    },
    dropdownItem: {
      display: 'flex', alignItems: 'center', gap: '10px', 
      padding: '12px 20px', fontSize: '14px', color: '#334155', 
      cursor: 'pointer', borderBottom: '1px solid #f8fafc',
      transition: 'background 0.2s'
    },
    notifItem: { padding: '15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
    notifText: { fontSize: '13px', color: '#334155', fontWeight: '500' },
    notifTime: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' }
  };

  return (
    <>
    <header style={styles.header}>
      
      {/* 1. Left: Menu & Search */}
      <div style={styles.leftSection}>
        <button style={styles.menuBtn} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        
        {/* Search Bar (Hidden on small screens) */}
        <div style={styles.searchBox} className="hidden md:flex">
          <Search size={18} color="#94a3b8"/>
          <input type="text" placeholder="Search..." style={styles.input} />
        </div>
      </div>

      {/* 2. Right: Icons & Profile */}
      <div style={styles.rightSection}>
        
        {/* --- BELL NOTIFICATION --- */}
        <div style={{position: 'relative'}}>
            <button 
                style={styles.iconBtn} 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            >
                <Bell size={20} />
                <span style={styles.badge}>3</span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div style={styles.dropdown}>
                    <div style={{padding:'15px', borderBottom:'1px solid #f1f5f9', fontWeight:'bold', color:'#1e293b'}}>Notifications</div>
                    {notifications.map(n => (
                        <div key={n.id} style={styles.notifItem} onClick={() => setShowNotifications(false)}>
                            <div style={styles.notifText}>{n.text}</div>
                            <div style={styles.notifTime}>{n.time}</div>
                        </div>
                    ))}
                    <div style={{padding:'10px', textAlign:'center', fontSize:'12px', color:'#2563eb', cursor:'pointer'}}>View All</div>
                </div>
            )}
        </div>

        {/* --- PROFILE DROPDOWN --- */}
        <div style={{position: 'relative'}}>
            <div 
                style={styles.profileBox} 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            >
                <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase() || 'A'}</div>
                <div className="hidden md:block">
                    <p style={styles.userName}>{user?.name || 'Admin'}</p>
                    <p style={styles.userRole}>{user?.role || 'Super Admin'}</p>
                </div>
                <ChevronDown size={16} color="#64748b"/>
            </div>

            {/* Profile Menu */}
            {showProfileMenu && (
                <div style={styles.dropdown}>
                    <div style={{padding:'20px', borderBottom:'1px solid #f1f5f9', backgroundColor:'#f8fafc'}}>
                        <p style={{fontWeight:'bold', fontSize:'16px', color:'#1e293b'}}>{user?.name}</p>
                        <p style={{fontSize:'12px', color:'#64748b'}}>{user?.email}</p>
                    </div>
                    
                    <div 
                        style={styles.dropdownItem} 
                        onClick={() => navigate('/settings')}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <Settings size={16}/> Settings
                    </div>
                    
                    <div 
                        style={{...styles.dropdownItem, color: '#ef4444'}} 
                        onClick={handleLogout}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <LogOut size={16}/> Logout
                    </div>
                </div>
            )}
        </div>

      </div>
    </header>
    
    {/* Overlay to close dropdowns when clicking outside */}
    {(showProfileMenu || showNotifications) && (
        <div 
            style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:30}} 
            onClick={() => { setShowProfileMenu(false); setShowNotifications(false); }}
        ></div>
    )}
    </>
  );
};

export default Header;