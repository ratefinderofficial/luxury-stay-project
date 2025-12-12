import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Lock, Shield, Save, ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'guest' // Default role
  });

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend API Call
      await axios.post('http://localhost:5000/api/v1/auth/register', formData);
      toast.success("User Created Successfully!");
      navigate('/users'); // Wapis list par jao
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES (Premium CSS) ---
  const styles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    },
    card: {
      backgroundColor: 'white',
      width: '100%',
      maxWidth: '600px',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      border: '1px solid #e2e8f0'
    },
    header: {
      backgroundColor: '#1e293b', // Dark Blue Header
      padding: '25px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: { fontSize: '20px', fontWeight: 'bold', margin: 0 },
    subtitle: { fontSize: '13px', opacity: 0.8, marginTop: '5px' },
    backBtn: { color: 'white', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', opacity: 0.8, transition: 'opacity 0.2s' },
    
    formBody: { padding: '30px' },
    
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    
    inputWrapper: { position: 'relative' },
    icon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    
    input: {
      width: '100%',
      padding: '12px 12px 12px 40px', // Left padding icon ke liye
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      fontSize: '14px',
      outline: 'none',
      transition: 'border 0.2s, box-shadow 0.2s'
    },
    
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },

    select: {
      width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: 'white', cursor: 'pointer', appearance: 'none'
    },

    footer: {
      padding: '20px 30px',
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '15px'
    },
    
    cancelBtn: {
      padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer'
    },
    submitBtn: {
      padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Header */}
        <div style={styles.header}>
            <div>
                <h1 style={styles.title}>Add New User</h1>
                <p style={styles.subtitle}>Create account for staff or admin</p>
            </div>
            <button style={styles.backBtn} onClick={() => navigate('/users')}>
                <ArrowLeft size={16}/> Back
            </button>
        </div>

        {/* Form */}
        <div style={styles.formBody}>
            <form onSubmit={handleSubmit}>
                
                {/* Name */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Full Name</label>
                    <div style={styles.inputWrapper}>
                        <User size={18} style={styles.icon}/>
                        <input 
                            type="text" placeholder="John Doe" required 
                            style={styles.input}
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            onFocus={e => e.target.style.borderColor = '#2563eb'}
                            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>
                </div>

                {/* Email & Phone Row */}
                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.icon}/>
                            <input 
                                type="email" placeholder="john@example.com" required 
                                style={styles.input}
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <div style={styles.inputWrapper}>
                            <Phone size={18} style={styles.icon}/>
                            <input 
                                type="text" placeholder="+1 234..." required 
                                style={styles.input}
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                    </div>
                </div>

                {/* Password & Role Row */}
                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon}/>
                            <input 
                                type="password" placeholder="••••••••" required 
                                style={styles.input}
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Role / Access</label>
                        <div style={styles.inputWrapper}>
                            <Shield size={18} style={styles.icon}/>
                            <select 
                                style={styles.select}
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                            >
                                <option value="guest">Guest</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="housekeeping">Housekeeping</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

            </form>
        </div>

        {/* Footer Buttons */}
        <div style={styles.footer}>
            <button style={styles.cancelBtn} type="button" onClick={() => navigate('/users')}>
                Cancel
            </button>
            <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : <><Save size={18}/> Create User</>}
            </button>
        </div>

      </div>
    </div>
  );
};

export default AddUser;