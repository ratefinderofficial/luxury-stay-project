import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const RoomStatus = () => {
  const [rooms, setRooms] = useState([]);

  // Fetch Rooms & Active Bookings to calculate time
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/rooms');
      setRooms(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
    // Har 1 minute baad refresh karo taake time update ho
    const interval = setInterval(fetchData, 60000); 
    return () => clearInterval(interval);
  }, []);

  // --- TIME CALCULATION LOGIC ---
  const getTimeStatus = (status, checkoutDate) => {
    if (status === 'Available') return { text: 'Ready', color: 'text-green-600', bg: 'bg-green-50' };
    
    if (status === 'Occupied') {
        // Asal project mein 'checkoutDate' booking se aayega.
        // Demo ke liye hum Maan letay hain ke aaj shaam 11:00 AM checkout hai.
        const checkout = new Date();
        checkout.setHours(11, 0, 0, 0); 
        
        const now = new Date();
        const diffMs = checkout - now;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHrs > 0) return { text: `Checkout in ${diffHrs} hrs`, color: 'text-blue-600', bg: 'bg-blue-50' };
        return { text: 'Checkout Due Now', color: 'text-red-600', bg: 'bg-red-50' };
    }

    if (status === 'Cleaning') {
        return { text: '~20 mins remaining', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    }

    if (status === 'Maintenance') {
        return { text: 'Under Repair', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  // Styles
  const styles = {
    container: { padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', height: 'calc(100vh - 80px)', overflowY: 'auto' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
    
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' },
    
    roomNo: { fontSize: '22px', fontWeight: '800', color: '#334155' },
    type: { fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' },
    
    timerBadge: (info) => ({
        padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
        backgroundColor: info?.bg || '#f3f4f6', color: info?.color || '#475569',
        display: 'flex', alignItems: 'center', gap: '6px'
    })
  };

  return (
    <div style={styles.container}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <h1 style={styles.title}>Live Room Status</h1>
        <button onClick={fetchData} style={{border:'none', background:'none', cursor:'pointer', color:'#2563eb'}}><RefreshCw size={20}/></button>
      </div>

      <div style={styles.grid}>
        {rooms.map(room => {
            const statusInfo = getTimeStatus(room.currentStatus);
            return (
                <div key={room._id} style={styles.card}>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span style={styles.roomNo}>{room.roomNumber}</span>
                        {room.currentStatus === 'Available' ? <CheckCircle size={20} color="#16a34a"/> : 
                         room.currentStatus === 'Cleaning' ? <RefreshCw size={20} color="#ca8a04"/> :
                         room.currentStatus === 'Maintenance' ? <AlertTriangle size={20} color="#475569"/> :
                         <Clock size={20} color="#2563eb"/>}
                    </div>
                    <span style={styles.type}>{room.type}</span>
                    
                    {/* TIMER / STATUS BADGE */}
                    <div style={styles.timerBadge(statusInfo)}>
                        <Clock size={14}/> {statusInfo.text}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default RoomStatus;