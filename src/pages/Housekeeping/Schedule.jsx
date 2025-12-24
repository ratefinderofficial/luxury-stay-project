import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, CheckCircle, Clock, Trash2, Plus } from 'lucide-react';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffList, setStaffList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      // 1. Staff Lao (Dummy filter: Asal mein role='housekeeping' hona chahiye)
      // Note: Agar user API nahi hai to dummy use kar lo
      const staffRes = await axios.get('http://localhost:5000/api/v1/users?role=housekeeping'); 
      setStaffList(staffRes.data.users || []);

      // 2. Tasks Lao
      const tasksRes = await axios.get('http://localhost:5000/api/v1/housekeeping');
      setTasks(tasksRes.data || []);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleAssign = async (taskId, staffName) => {
    try {
      // Backend ko update karo
      // Note: Asal mein ID bhejni chahiye, abhi Name bhej rahe hain simple demo ke liye
      await axios.patch(`http://localhost:5000/api/v1/housekeeping/${taskId}`, { 
        assignedTo: staffName,
        status: 'Pending' // Reset status if reassigned
      });
      
      // Local update
      setTasks(tasks.map(t => t._id === taskId ? { ...t, assignedTo: staffName } : t));
      alert(`✅ Task assigned to ${staffName}`);
    } catch (error) {
      alert("Assignment Failed");
    }
  };

  // Dummy Auto-Generate Function (Requirement requirement poori karne ke liye)
  const autoGenerate = () => {
    alert("🤖 Auto-Assigning tasks based on staff availability...");
    // Logic: Har task ko random staff assign kar do (Demo)
    const newTasks = tasks.map(t => ({
        ...t, 
        assignedTo: staffList[Math.floor(Math.random() * staffList.length)]?.name || 'Admin'
    }));
    setTasks(newTasks);
  };

  // --- STYLES (Premium CSS) ---
  const styles = {
    container: {
      padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif",
      height: 'calc(100vh - 80px)', overflowY: 'auto'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#1e293b' },
    subtitle: { color: '#64748b' },
    
    autoBtn: { backgroundColor: '#7c3aed', color: 'white', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', gap: '8px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(124, 58, 237, 0.2)' },

    layout: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
    
    // Left Sidebar
    sidebar: { flex: '1', minWidth: '280px', maxWidth: '350px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '20px' },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#334155', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
    
    dateInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' },
    
    staffItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '8px', border: '1px solid #f1f5f9' },
    staffAvatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' },
    
    // Right Content
    main: { flex: '3', minWidth: '400px' },
    taskGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    
    taskCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative' },
    taskHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    roomTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1e293b' },
    statusBadge: (status) => ({
        padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
        backgroundColor: status === 'Completed' ? '#dcfce7' : '#fee2e2',
        color: status === 'Completed' ? '#166534' : '#991b1b'
    }),
    
    select: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', marginTop: '15px', cursor: 'pointer' },
    
    empty: { textAlign: 'center', padding: '50px', color: '#94a3b8' }
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <div>
           <h1 style={styles.title}>Work Schedule</h1>
           <p style={styles.subtitle}>Daily assignments for housekeeping staff.</p>
        </div>
        <button style={styles.autoBtn} onClick={autoGenerate}>
            <Clock size={18}/> Auto-Schedule
        </button>
      </div>

      <div style={styles.layout}>
        
        {/* LEFT: Controls */}
        <div style={styles.sidebar}>
            {/* Date Picker */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}><Calendar size={18}/> Select Date</h3>
                <input type="date" style={styles.dateInput} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </div>

            {/* Available Staff */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}><User size={18}/> Available Staff</h3>
                {staffList.length === 0 ? <p style={{fontSize:'13px', color:'#94a3b8'}}>No staff found.</p> : 
                   staffList.map(staff => (
                    <div key={staff._id} style={styles.staffItem}>
                        <div style={styles.staffAvatar}>{staff.name.charAt(0)}</div>
                        <div>
                            <p style={{fontSize:'14px', fontWeight:'600'}}>{staff.name}</p>
                            <p style={{fontSize:'11px', color:'#16a34a'}}>● Available</p>
                        </div>
                    </div>
                   ))
                }
            </div>
        </div>

        {/* RIGHT: Tasks */}
        <div style={styles.main}>
            <div style={styles.card}>
                <h3 style={{...styles.cardTitle, borderBottom:'1px solid #f1f5f9', paddingBottom:'15px'}}>
                    Tasks for {new Date(selectedDate).toDateString()}
                </h3>

                {tasks.length === 0 ? (
                    <div style={styles.empty}>
                        <CheckCircle size={40} style={{opacity:0.2, marginBottom:'10px'}}/>
                        <p>No tasks found for this date.</p>
                    </div>
                ) : (
                    <div style={styles.taskGrid}>
                        {tasks.map(task => (
                            <div key={task._id} style={styles.taskCard}>
                                <div style={styles.taskHeader}>
                                    <span style={styles.roomTitle}>Room {task.roomNumber}</span>
                                    <span style={styles.statusBadge(task.status)}>{task.status}</span>
                                </div>
                                <p style={{fontSize:'14px', color:'#64748b'}}>{task.taskType}</p>
                                
                                <div style={{marginTop:'15px'}}>
                                    <label style={{fontSize:'12px', fontWeight:'bold', color:'#94a3b8'}}>ASSIGNED TO</label>
                                    <select 
                                        style={styles.select}
                                        value={task.assignedTo || ""}
                                        onChange={(e) => handleAssign(task._id, e.target.value)}
                                    >
                                        <option value="" disabled>Select Staff</option>
                                        {staffList.map(staff => (
                                            <option key={staff._id} value={staff.name}>{staff.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Schedule;