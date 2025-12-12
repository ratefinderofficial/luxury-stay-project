import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, AlertTriangle, ArrowLeft } from 'lucide-react';

const LogIssue = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

const [formData, setFormData] = useState({
  roomNumber: '',    // ✅ Sahi
  issue: '',         // ✅ Sahi
  priority: 'Medium',
  category: 'Other'
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roomNumber || !formData.issue) {
      return alert('Please fill all required fields');
    }

    setLoading(true);
    try {
      // Direct Axios call to ensure it works with previous Backend code
      await axios.post('http://localhost:5000/api/v1/maintenance', formData);
      alert('✅ Maintenance Request Submitted!');
      navigate('/maintenance'); // Wapis list par bhejo
    } catch (err) {
      console.error(err);
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES (Premium CSS) ---
  const styles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', sans-serif",
      height: 'calc(100vh - 80px)', // Scroll Fix
      overflowY: 'auto'
    },
    wrapper: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px'
    },
    backBtn: {
      background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
      display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', fontSize: '14px'
    },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0' },
    subtitle: { color: '#64748b', marginTop: '5px' },

    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    },

    // Warning Box
    warningBox: {
      backgroundColor: '#fffbeb',
      border: '1px solid #fcd34d',
      color: '#92400e',
      padding: '15px',
      borderRadius: '8px',
      display: 'flex',
      gap: '12px',
      alignItems: 'start',
      marginBottom: '30px',
      fontSize: '14px',
      lineHeight: '1.5'
    },

    // Form Layout
    row: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    col: { flex: 1, minWidth: '250px' },
    
    label: {
      display: 'block',
      fontWeight: '600',
      fontSize: '13px',
      color: '#475569',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    input: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: '1px solid #cbd5e1',
      fontSize: '15px',
      color: '#334155',
      outline: 'none',
      backgroundColor: '#f8fafc',
      transition: 'border 0.2s'
    },
    select: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: '1px solid #cbd5e1',
      fontSize: '15px',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: '1px solid #cbd5e1',
      fontSize: '15px',
      backgroundColor: '#f8fafc',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical'
    },

    // Priority Radios
    radioGroup: { display: 'flex', gap: '15px' },
    radioLabel: (isActive, level) => {
        let activeColor = '#3b82f6'; // Default Blue
        if(level === 'High') activeColor = '#ef4444';
        if(level === 'Medium') activeColor = '#f59e0b';
        if(level === 'Low') activeColor = '#10b981';

        return {
            padding: '10px 20px',
            borderRadius: '8px',
            border: `1px solid ${isActive ? activeColor : '#e2e8f0'}`,
            backgroundColor: isActive ? `${activeColor}15` : 'white', // 15 is opacity
            color: isActive ? activeColor : '#64748b',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
        };
    },

    // Submit Button
    submitBtn: {
      width: '100%',
      padding: '16px',
      marginTop: '20px',
      backgroundColor: '#b45309', // Gold/Bronze color
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 4px 15px rgba(180, 83, 9, 0.3)',
      transition: 'transform 0.1s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* Header */}
        <div style={styles.header}>
            <button onClick={() => navigate('/maintenance')} style={styles.backBtn}>
                <ArrowLeft size={18}/> Back to List
            </button>
            <h1 style={styles.title}>Log Maintenance Issue</h1>
            <p style={styles.subtitle}>Report a defect or repair requirement.</p>
        </div>

        <CardStyles>
            {/* Warning Box */}
            <div style={styles.warningBox}>
                <AlertTriangle size={24} />
                <div>
                    <strong>Important Note:</strong> For emergencies like <span style={{textDecoration:'underline'}}>water leaks</span> or <span style={{textDecoration:'underline'}}>electrical sparks</span>, please set the Priority to <strong>High</strong> immediately.
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                {/* Row 1: Room & Category */}
                <div style={styles.row}>
                    <div style={styles.col}>
                        <label style={styles.label}>Room Number / Area</label>
                        <input 
                            type="text" 
                            placeholder="e.g. 101 or Lobby" 
                            style={styles.input}
                            value={formData.roomNumber}
                            onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                        />
                    </div>
                    <div style={styles.col}>
                        <label style={styles.label}>Category</label>
                        <select 
                            style={styles.select}
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option>Other</option>
                            <option>Plumbing</option>
                            <option>Electrical</option>
                            <option>Furniture</option>
                            <option>Appliance</option>
                        </select>
                    </div>
                </div>

                {/* Priority Selection */}
                <div style={{marginBottom: '25px'}}>
                    <label style={styles.label}>Priority Level</label>
                    <div style={styles.radioGroup}>
                        {['Low', 'Medium', 'High'].map((level) => (
                            <div 
                                key={level} 
                                style={styles.radioLabel(formData.priority === level, level)}
                                onClick={() => setFormData({...formData, priority: level})}
                            >
                                <div style={{
                                    width:'12px', height:'12px', borderRadius:'50%', 
                                    border: '2px solid currentColor',
                                    backgroundColor: formData.priority === level ? 'currentColor' : 'transparent'
                                }}></div>
                                {level}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div style={{marginBottom: '25px'}}>
                    <label style={styles.label}>Issue Description</label>
                    <textarea 
                        placeholder="Describe the problem clearly..." 
                        style={styles.textarea}
                        value={formData.issue}
                        onChange={(e) => setFormData({...formData, issue: e.target.value})}
                    ></textarea>
                </div>

                {/* Button */}
                <button 
                    type="submit" 
                    style={styles.submitBtn} 
                    disabled={loading}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.01)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    {loading ? "Submitting..." : <><Save size={20}/> Submit Request</>}
                </button>

            </form>
        </CardStyles>

      </div>
    </div>
  );
};

// Simple Wrapper Component for clean code
const CardStyles = ({ children }) => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0'
    }}>
        {children}
    </div>
);

export default LogIssue;