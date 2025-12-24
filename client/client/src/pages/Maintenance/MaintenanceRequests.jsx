import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle, Clock, AlertTriangle, Plus, X } from 'lucide-react';

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    issue: '',
    priority: 'Medium'
  });

  // Fetch Data
  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/maintenance');
      setRequests(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Add Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/maintenance', formData);
      alert("✅ Maintenance Request Logged!");
      setFormData({ roomNumber: '', issue: '', priority: 'Medium' });
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      alert("Error logging request");
    }
  };

  // Update Status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/maintenance/${id}`, { status: newStatus });
      fetchRequests(); // Refresh list
    } catch (error) {
      alert("Failed to update status");
    }
  };

  // --- STYLES (Normal CSS) ---
  const styles = {
    container: { width: '250%', padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", height: 'calc(100vh - 80px)', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#1e293b' },
    subtitle: { color: '#64748b' },
    addBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)' },
    
    // Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    
    // Card
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative', transition: 'transform 0.2s' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
    roomBadge: { backgroundColor: '#f1f5f9', color: '#475569', padding: '5px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' },
    priorityBadge: (priority) => ({
      padding: '5px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
      backgroundColor: priority === 'High' ? '#fee2e2' : priority === 'Medium' ? '#ffedd5' : '#dcfce7',
      color: priority === 'High' ? '#991b1b' : priority === 'Medium' ? '#9a3412' : '#166534'
    }),
    
    issueText: { fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '10px' },
    meta: { fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' },
    
    // Actions
    actionArea: { borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    statusLabel: (status) => ({
      fontSize: '13px', fontWeight: 'bold',
      color: status === 'Completed' ? '#16a34a' : status === 'In Progress' ? '#d97706' : '#dc2626'
    }),
    btnGroup: { display: 'flex', gap: '10px' },
    iconBtn: { border: '1px solid #e2e8f0', backgroundColor: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' },

    // Modal Form
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' },
    label: { display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#475569' },
    submitBtn: { width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Maintenance</h1>
          <p style={styles.subtitle}>Track and resolve room issues.</p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>
          <Plus size={20}/> Report Issue
        </button>
      </div>

      {/* Grid of Issues */}
      <div style={styles.grid}>
        {requests.map((req) => (
          <div key={req._id} style={styles.card}>
            
            <div style={styles.cardHeader}>
               <span style={styles.roomBadge}>Room {req.roomNumber}</span>
               <span style={styles.priorityBadge(req.priority)}>{req.priority} Priority</span>
            </div>

            <h3 style={styles.issueText}>{req.issue}</h3>
            
            <div style={styles.meta}>
               <Clock size={14}/> 
               Reported on {new Date(req.createdAt).toLocaleDateString()}
            </div>

            <div style={styles.actionArea}>
               <div style={styles.statusLabel(req.status)}>
                  {req.status === 'Completed' && <CheckCircle size={16} style={{display:'inline', marginRight:5}}/>}
                  {req.status}
               </div>
               
               {/* Actions Buttons */}
               {req.status !== 'Completed' && (
                 <div style={styles.btnGroup}>
                    {req.status === 'Pending' && (
                        <button 
                          style={{...styles.iconBtn, color: '#d97706', borderColor: '#fdba74'}} 
                          title="Mark In Progress"
                          onClick={() => updateStatus(req._id, 'In Progress')}
                        >
                            <Wrench size={16}/> Start
                        </button>
                    )}
                    <button 
                      style={{...styles.iconBtn, color: '#16a34a', borderColor: '#86efac'}} 
                      title="Mark Completed"
                      onClick={() => updateStatus(req._id, 'Completed')}
                    >
                        <CheckCircle size={16}/> Fix
                    </button>
                 </div>
               )}
            </div>

          </div>
        ))}
      </div>

      {/* --- ADD REQUEST MODAL FORM --- */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
             <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h2 style={{fontSize:'20px', fontWeight:'bold'}}>Report New Issue</h2>
                <button onClick={() => setShowForm(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X/></button>
             </div>
             
             <form onSubmit={handleSubmit}>
                <label style={styles.label}>Room Number</label>
                <input type="text" placeholder="e.g. 101" style={styles.input} required 
                   value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />

                <label style={styles.label}>Issue Description</label>
                <input type="text" placeholder="e.g. AC not cooling" style={styles.input} required 
                   value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} />

                <label style={styles.label}>Priority</label>
                <select style={styles.input} value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                   <option>Low</option>
                   <option>Medium</option>
                   <option>High</option>
                </select>

                <button type="submit" style={styles.submitBtn}>Submit Report</button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenanceRequests;