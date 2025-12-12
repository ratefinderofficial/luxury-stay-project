import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const GuestLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ 
        backgroundColor: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a8a', cursor:'pointer' }} onClick={() => navigate('/guest/dashboard')}>
          LuxuryStay
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: '#334155', display: 'none', md: 'block' }}>{user?.name}</span>
          <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Pages yahan render honge */}
      <Outlet />
    </div>
  );
};

export default GuestLayout;