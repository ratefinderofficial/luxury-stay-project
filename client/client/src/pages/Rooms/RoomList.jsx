import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, BedDouble, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomList = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. FETCH ROOMS FUNCTION ---
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/v1/rooms');
      
      console.log("Fetched Rooms:", res.data); // Console check

      // Safety check: Data array hai ya object?
      if (Array.isArray(res.data)) {
        setRooms(res.data);
      } else if (res.data && Array.isArray(res.data.rooms)) {
        setRooms(res.data.rooms);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  // Page Load hone par data lao
  useEffect(() => {
    fetchRooms();
  }, []);

  // --- 2. DELETE ROOM ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/v1/rooms/${id}`);
      setRooms(rooms.filter(room => room._id !== id)); // List se hatao
      toast.success("Room Deleted Successfully");
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  // Filter Logic
  const filteredRooms = rooms.filter(room => 
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- STYLES ---
  const styles = {
    container: { padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', height: 'calc(100vh - 80px)', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#1e293b' },
    
    toolbar: { display: 'flex', gap: '15px', marginBottom: '20px' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '300px' },
    input: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%' },
    
    addBtn: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    refreshBtn: { backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '10px', cursor: 'pointer', color: '#64748b' },

    tableContainer: { backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '15px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700' },
    td: { padding: '15px 20px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '14px' },
    
    badge: (status) => {
        const colors = {
            'Available': { bg: '#dcfce7', text: '#166534' },
            'Occupied': { bg: '#dbeafe', text: '#1e40af' },
            'Maintenance': { bg: '#fee2e2', text: '#991b1b' },
            'Cleaning': { bg: '#fef3c7', text: '#92400e' }
        };
        const style = colors[status] || colors['Available'];
        return { backgroundColor: style.bg, color: style.text, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
    }
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <div>
            <h1 style={styles.title}>Room Inventory</h1>
            <p style={{color:'#64748b'}}>Manage hotel rooms and availability.</p>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
            <button style={styles.refreshBtn} onClick={fetchRooms} title="Refresh List">
                <RefreshCw size={20}/>
            </button>
            <button style={styles.addBtn} onClick={() => navigate('/rooms/add')}>
                <Plus size={20}/> Add New Room
            </button>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
            <Search size={18} color="#94a3b8"/>
            <input 
                placeholder="Search Room Number..." 
                style={styles.input} 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
            />
        </div>
      </div>

      <div style={styles.tableContainer}>
        {loading ? (
            <div style={{padding:'50px', textAlign:'center', color:'#64748b'}}>Loading Rooms...</div>
        ) : (
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Room No</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.th}>Price</th>
                        <th style={styles.th}>Capacity</th>
                        <th style={styles.th}>Status</th>
                        <th style={{...styles.th, textAlign:'right'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRooms.length === 0 ? (
                        <tr><td colSpan="6" style={{padding:'40px', textAlign:'center', color:'#94a3b8'}}>No rooms found. Add one!</td></tr>
                    ) : (
                        filteredRooms.map((room) => (
                            <tr key={room._id} style={{borderBottom:'1px solid #f1f5f9'}}>
                                <td style={styles.td}><strong>{room.roomNumber}</strong></td>
                                <td style={styles.td}>{room.type}</td>
                                <td style={styles.td}>${room.price}</td>
                                <td style={styles.td}>{room.capacity} Guests</td>
                                <td style={styles.td}>
                                    <span style={styles.badge(room.currentStatus)}>{room.currentStatus}</span>
                                </td>
                                <td style={{...styles.td, textAlign:'right'}}>
                                    <button onClick={() => navigate(`/rooms/edit/${room._id}`)} style={{border:'none', background:'none', cursor:'pointer', marginRight:'10px', color:'#2563eb'}}>
                                        <Edit size={18}/>
                                    </button>
                                    <button onClick={() => handleDelete(room._id)} style={{border:'none', background:'none', cursor:'pointer', color:'#ef4444'}}>
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        )}
      </div>

    </div>
  );
};

export default RoomList;