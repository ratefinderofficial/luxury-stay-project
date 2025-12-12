import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, CheckCircle, Clock, User, Plus, Trash2, X, PlayCircle } from 'lucide-react';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All'); // All, Pending, Completed
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    taskType: 'Daily Cleaning',
    assignedTo: '',
    instructions: ''
  });

  // --- FETCH DATA ---
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/housekeeping');
      setTasks(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- HANDLERS ---
  const handleAddTask = async (e) => {
    e.preventDefault();
    if(!formData.roomNumber || !formData.assignedTo) return alert("Please fill required fields");
    
    try {
      await axios.post('http://localhost:5000/api/v1/housekeeping', formData);
      alert("✅ Task Assigned Successfully!");
      setFormData({ roomNumber: '', taskType: 'Daily Cleaning', assignedTo: '', instructions: '' });
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      alert("Error assigning task");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/housekeeping/${id}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/housekeeping/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  // Filter Logic
  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  // --- STYLES (Premium CSS) ---
  const styles = {
    container: {
     width: '200%', padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif",
      height: 'calc(100vh - 80px)', overflowY: 'auto'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#1e293b' },
    addBtn: { backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' },
    
    // Tabs
    tabs: { display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' },
    tabBtn: (isActive) => ({
      padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
      backgroundColor: isActive ? '#e0f2fe' : 'transparent', color: isActive ? '#0284c7' : '#64748b'
    }),

    // Card Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
    
    card: { backgroundColor: 'white', borderRadius: '16px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative' },
    
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    roomBadge: { backgroundColor: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' },
    
    statusBadge: (status) => ({
      padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase',
      backgroundColor: status === 'Completed' ? '#dcfce7' : status === 'In Progress' ? '#fef9c3' : '#fee2e2',
      color: status === 'Completed' ? '#166534' : status === 'In Progress' ? '#854d0e' : '#991b1b'
    }),

    infoRow: { display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '14px', marginBottom: '8px' },
    
    footer: { marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    
    actionBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' },

    // Modal
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '450px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#475569' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' },
    submitBtn: { width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <div>
           <h1 style={styles.title}>Housekeeping Tasks</h1>
           <p style={{color:'#64748b'}}>Manage room cleaning assignments.</p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            <Plus size={20}/> Assign Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={styles.tabs}>
        {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
            <button key={status} style={styles.tabBtn(filter === status)} onClick={() => setFilter(status)}>
                {status}
            </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div style={styles.grid}>
        {filteredTasks.length === 0 ? <p style={{color:'#94a3b8'}}>No tasks found in this category.</p> : 
          filteredTasks.map((task) => (
          <div key={task._id} style={styles.card}>
             
             <div style={styles.cardHeader}>
                <span style={styles.roomBadge}>Room {task.roomNumber}</span>
                <span style={styles.statusBadge(task.status)}>{task.status}</span>
             </div>

             <div style={{marginBottom: '15px'}}>
                <h3 style={{fontSize:'16px', fontWeight:'bold', color:'#334155'}}>{task.taskType}</h3>
                <p style={{fontSize:'13px', color:'#94a3b8', fontStyle:'italic'}}>"{task.instructions || 'No special instructions'}"</p>
             </div>

             <div style={styles.infoRow}> <User size={16}/> Assigned to: <strong>{task.assignedTo}</strong> </div>
             <div style={styles.infoRow}> <Clock size={16}/> {new Date(task.createdAt).toLocaleDateString()} </div>

             <div style={styles.footer}>
                {/* Delete Btn */}
                <button onClick={() => handleDelete(task._id)} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}} title="Delete">
                    <Trash2 size={18}/>
                </button>

                {/* Status Actions */}
                <div style={{display:'flex', gap:'10px'}}>
                    {task.status === 'Pending' && (
                        <button style={{...styles.actionBtn, backgroundColor:'#e0f2fe', color:'#0284c7'}} onClick={() => updateStatus(task._id, 'In Progress')}>
                            <PlayCircle size={16}/> Start
                        </button>
                    )}
                    {task.status !== 'Completed' && (
                        <button style={{...styles.actionBtn, backgroundColor:'#dcfce7', color:'#166534'}} onClick={() => updateStatus(task._id, 'Completed')}>
                            <CheckCircle size={16}/> Complete
                        </button>
                    )}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* --- ADD TASK MODAL --- */}
      {showModal && (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                    <h2 style={{fontSize:'20px', fontWeight:'bold'}}>Assign New Task</h2>
                    <button onClick={() => setShowModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X/></button>
                </div>

                <form onSubmit={handleAddTask}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Room Number</label>
                        <input type="text" placeholder="e.g. 101" style={styles.input} value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} required/>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Assigned Staff (Name)</label>
                        <input type="text" placeholder="e.g. Sarah Jones" style={styles.input} value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} required/>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Task Type</label>
                        <select style={styles.input} value={formData.taskType} onChange={e => setFormData({...formData, taskType: e.target.value})}>
                            <option>Daily Cleaning</option>
                            <option>Deep Cleaning</option>
                            <option>Laundry Service</option>
                            <option>Sanitization</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Special Instructions</label>
                        <input type="text" placeholder="e.g. Extra towels needed" style={styles.input} value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})}/>
                    </div>

                    <button type="submit" style={styles.submitBtn}>Assign Task</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default TasksList;