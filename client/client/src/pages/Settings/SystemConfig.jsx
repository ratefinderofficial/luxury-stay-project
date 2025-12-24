import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 👈 Import Zaroori hai
import { Save, Building, CreditCard, Clock } from 'lucide-react';

const SystemConfig = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // Form State (Default Values)
  const [config, setConfig] = useState({
    hotelName: '',
    email: '',
    phone: '',
    address: '',
    currency: 'USD ($)',
    taxRate: 0,
    serviceCharge: 0,
    checkInTime: '14:00',
    checkOutTime: '11:00'
  });

  // --- 1. FETCH SETTINGS FROM DB (Important) ---
  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/settings');
            // Agar data mile to set karo
            if (res.data) {
                setConfig(prev => ({ ...prev, ...res.data }));
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };
    fetchSettings();
  }, []);

  // --- 2. HANDLE CHANGE ---
  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  // --- 3. SAVE SETTINGS ---
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await axios.put('http://localhost:5000/api/v1/settings', config);
        alert("✅ Settings Saved to Database!");
    } catch (error) {
        console.error(error);
        alert("Error saving settings");
    } finally {
        setLoading(false);
    }
  };

  // --- STYLES (Fixed) ---
  const styles = {
    pageContainer: {
        backgroundColor: '#f3f4f6', 
        minHeight: '100vh',
        padding: '30px',
        fontFamily: "'Segoe UI', sans-serif",
        height: 'calc(100vh - 80px)',
        overflowY: 'auto'
    },
    header: { marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e5e7eb' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 5px 0' },
    subtitle: { color: '#6b7280', fontSize: '14px', margin: 0 },
    
    layout: { display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' },
    
    sidebar: {
        flex: '0 0 260px', backgroundColor: 'white', borderRadius: '12px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', padding: '15px', border: '1px solid #e5e7eb'
    },
    sidebarTitle: { fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '15px', paddingLeft: '10px' },
    
    menuButton: (isActive) => ({
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px',
        marginBottom: '8px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
        cursor: 'pointer', transition: 'all 0.2s',
        backgroundColor: isActive ? '#2563eb' : 'transparent',
        color: isActive ? '#ffffff' : '#4b5563',
        boxShadow: isActive ? '0 4px 6px rgba(37, 99, 235, 0.2)' : 'none'
    }),

    mainContent: {
        flex: '1', backgroundColor: 'white', borderRadius: '12px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', padding: '30px', border: '1px solid #e5e7eb'
    },
    
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' },
    
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    formGroup: { marginBottom: '15px' },
    
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' },
    
    input: {
        width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f9fafb'
    },
    
    // 🟢 FIX: Width 140% se 100% kar di
    select: {
        width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f9fafb', cursor: 'pointer'
    },
    
    noteBox: { marginTop: '20px', padding: '15px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', color: '#92400e', fontSize: '13px' },
    
    footer: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' },
    
    saveBtn: {
        backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 25px',
        borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(22, 163, 74, 0.2)'
    }
  };

  return (
    <div style={styles.pageContainer}>
        <div style={styles.header}>
            <h1 style={styles.title}>System Configuration</h1>
            <p style={styles.subtitle}>Manage global settings for your hotel.</p>
        </div>

        <div style={styles.layout}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarTitle}>Settings Menu</div>
                
                <button style={styles.menuButton(activeTab === 'general')} onClick={() => setActiveTab('general')}>
                    <Building size={18} /> General Info
                </button>
                <button style={styles.menuButton(activeTab === 'finance')} onClick={() => setActiveTab('finance')}>
                    <CreditCard size={18} /> Billing & Tax
                </button>
                <button style={styles.menuButton(activeTab === 'policies')} onClick={() => setActiveTab('policies')}>
                    <Clock size={18} /> Hotel Policies
                </button>
            </div>

            <div style={styles.mainContent}>
                <form onSubmit={handleSave}>
                    
                    {activeTab === 'general' && (
                        <div>
                            <div style={styles.sectionTitle}><Building size={20} color="#2563eb"/> General Information</div>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}><label style={styles.label}>Hotel Name</label><input type="text" name="hotelName" value={config.hotelName} onChange={handleChange} style={styles.input} /></div>
                                <div style={styles.formGroup}><label style={styles.label}>Official Email</label><input type="email" name="email" value={config.email} onChange={handleChange} style={styles.input} /></div>
                                <div style={styles.formGroup}><label style={styles.label}>Phone Number</label><input type="text" name="phone" value={config.phone} onChange={handleChange} style={styles.input} /></div>
                                <div style={styles.formGroup}><label style={styles.label}>Address</label><input type="text" name="address" value={config.address} onChange={handleChange} style={styles.input} /></div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'finance' && (
                        <div>
                            <div style={styles.sectionTitle}><CreditCard size={20} color="#2563eb"/> Billing & Taxes</div>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Currency</label>
                                    <select name="currency" value={config.currency} onChange={handleChange} style={styles.select}>
                                        <option>USD ($)</option><option>PKR (Rs)</option><option>EUR (€)</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}><label style={styles.label}>Tax Rate (%)</label><input type="number" name="taxRate" value={config.taxRate} onChange={handleChange} style={styles.input} /></div>
                                <div style={styles.formGroup}><label style={styles.label}>Service Charge (%)</label><input type="number" name="serviceCharge" value={config.serviceCharge} onChange={handleChange} style={styles.input} /></div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'policies' && (
                        <div>
                            <div style={styles.sectionTitle}><Clock size={20} color="#2563eb"/> Hotel Policies</div>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}><label style={styles.label}>Check-in Time</label><input type="time" name="checkInTime" value={config.checkInTime} onChange={handleChange} style={styles.input} /></div>
                                <div style={styles.formGroup}><label style={styles.label}>Check-out Time</label><input type="time" name="checkOutTime" value={config.checkOutTime} onChange={handleChange} style={styles.input} /></div>
                            </div>
                            <div style={styles.noteBox}><strong>⚠️ Note:</strong> Policy changes apply to new bookings only.</div>
                        </div>
                    )}

                    <div style={styles.footer}>
                        <button type="submit" disabled={loading} style={styles.saveBtn}>
                            {loading ? "Saving..." : <><Save size={18}/> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default SystemConfig;