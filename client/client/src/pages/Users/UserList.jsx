import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

// API & Hooks
import { userAPI } from '../../api/userAPI';
import useAxios from '../../hooks/useAxios';
import useDebounce from '../../hooks/useDebounce';
import useAuth from '../../hooks/useAuth';

// Components
import Button from '../../components/UI/Button';
import Avatar from '../../components/UI/Avatar';
import Loader from '../../components/UI/Loader';
import Pagination from '../../components/Common/Pagination';

const UserList = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { execute, loading } = useAxios();
  const { execute: deleteExecute } = useAxios();

  const fetchUsers = async () => {
    try {
      const result = await execute(userAPI.getAllUsers, {
        search: debouncedSearch,
        role: roleFilter,
        page: currentPage,
        limit: 10
      });
      setUsers(result.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, roleFilter, currentPage]);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error("Cannot delete yourself.");
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteExecute(userAPI.deleteUser, id);
      toast.success("User deleted");
      fetchUsers(); 
    } catch (err) {
      toast.error("Failed");
    }
  };

  // --- FLAT & FULL WIDTH STYLES (NO CARDS) ---
  const styles = {
    // 1. Page Container
    pageContainer: {
      width: '130%',
      boxSizing: 'border-box',
    },
    
    // 2. Header
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e5e7eb' // Sirf ek line niche separator ke liye
    },
    title: { fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 },
    subtitle: { color: '#6b7280', marginTop: '4px', fontSize: '14px' },

    // 3. Controls (Transparent Background, No Box)
    controlsBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      width: '130%',
      gap: '15px',
      flexWrap: 'wrap'
    },
    searchWrapper: {
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center',
        flex: 1, 
        minWidth: '250px'
    },
    searchInput: {
      padding: '12px 15px 12px 40px',
      borderRadius: '8px',
      border: '1px solid #d1d5db', // Darker border for visibility
      width: '100%', 
      outline: 'none',
      fontSize: '14px',
      backgroundColor: 'white',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    selectInput: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      cursor: 'pointer',
      backgroundColor: 'white',
      minWidth: '150px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },

    // 4. Table (FLAT - No Card, No Shadow)
    tableWrapper: {
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'transparent' // Background hata diya
    },
    table: {
      width: '100%', 
      borderCollapse: 'separate', // Allows spacing
      borderSpacing: '0 8px', // Row ke beech mein gap
      textAlign: 'left',
      minWidth: '800px'
    },
    th: {
      padding: '12px 20px',
      color: '#6b7280',
      fontWeight: '700',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: 'none'
    },
    // Row Styling (Card effect on ROWS instead of TABLE)
    row: {
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', // Halki shadow har row par
        transition: 'transform 0.1s',
    },
    tdFirst: {
        padding: '16px 20px',
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px'
    },
    tdLast: {
        padding: '16px 20px',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        textAlign: 'right'
    },
    td: {
        padding: '16px 20px',
        color: '#334155',
        verticalAlign: 'middle',
        fontSize: '14px'
    },
    
    // User Info
    userInfo: { display: 'flex', alignItems: 'center' },
    avatarBox: {
      width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden',
      border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
      marginRight: '15px', flexShrink: 0
    },
    
    // Badges
    badge: {
      padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      display: 'inline-block'
    },
    actionBtn: {
      background: '#f3f4f6', border: 'none', cursor: 'pointer', padding: '8px',
      borderRadius: '8px', transition: 'all 0.2s'
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
        case 'Admin': return { bg: '#fee2e2', text: '#ef4444' }; 
        case 'Manager': return { bg: '#e0f2fe', text: '#0ea5e9' }; 
        case 'Receptionist': return { bg: '#dcfce7', text: '#22c55e' }; 
        default: return { bg: '#f1f5f9', text: '#64748b' }; 
    }
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* Header (Clean) */}
      <div style={styles.header}>
        <div>
            <h1 style={styles.title}>User Management</h1>
            <p style={styles.subtitle}>Team members & guest accounts</p>
        </div>
        <Button onClick={() => navigate('/users/add')}>
            <UserPlus size={18} style={{ marginRight: '8px' }} /> Add User
        </Button>
      </div>

      {/* Controls (Floating Inputs) */}
      <div style={styles.controlsBar}>
        <div style={styles.searchWrapper}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: '#9ca3af' }} />
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput} 
            />
        </div>

        <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            style={styles.selectInput}
        >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Guest">Guest</option>
        </select>
      </div>

      {/* Table (Rows Floating) */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center' }}><Loader /></div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
              <thead>
              <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
              </thead>
              <tbody>
              {users.map((user) => {
                  const badge = getRoleColor(user.role);
                  return (
                  <tr key={user._id} style={styles.row}>
                      
                      <td style={styles.tdFirst}>
                          <div style={styles.userInfo}>
                              <div style={styles.avatarBox}>
                                  <Avatar src={user.avatar} name={user.name} />
                              </div>
                              <div>
                                  <div style={{ fontWeight: '700', color: '#1e293b' }}>{user.name}</div>
                                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{user.phone || 'No phone'}</div>
                              </div>
                          </div>
                      </td>

                      <td style={styles.td}>
                          <span style={{ ...styles.badge, backgroundColor: badge.bg, color: badge.text }}>
                              {user.role}
                          </span>
                      </td>

                      <td style={styles.td}>{user.email}</td>

                      <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ 
                                  width: '8px', height: '8px', borderRadius: '50%', 
                                  backgroundColor: user.isActive ? '#22c55e' : '#ef4444' 
                              }}></div>
                              <span style={{ 
                                  color: user.isActive ? '#15803d' : '#b91c1c', 
                                  fontSize: '13px', fontWeight: '600'
                              }}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                          </div>
                      </td>

                      <td style={styles.tdLast}>
                          <button style={styles.actionBtn} title="Edit">
                              <Edit size={18} color="#64748b" />
                          </button>
                          <button 
                              onClick={() => handleDelete(user._id)} 
                              style={{ ...styles.actionBtn, marginLeft: '8px', background: '#fee2e2' }} 
                              title="Delete"
                              disabled={user.role === 'Admin'}
                          >
                              <Trash2 size={18} color="#ef4444" />
                          </button>
                      </td>
                  </tr>
                  );
              })}
              {users.length === 0 && (
                  <tr>
                      <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                          No users found.
                      </td>
                  </tr>
              )}
              </tbody>
          </table>
        </div>
      )}
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={1} 
        onPageChange={setCurrentPage} 
      />

    </div>
  );
};

export default UserList;