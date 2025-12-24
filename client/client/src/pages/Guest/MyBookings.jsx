import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, MapPin, CreditCard, Clock, FileText } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        // Backend ko Email aur ID dono bhejo
        const res = await axios.get(`http://localhost:5000/api/v1/bookings/my-bookings?email=${user.email}&userId=${user._id}`);
        setBookings(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // --- STYLES (Premium) ---
  const styles = {
    container: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px', fontFamily: "'Segoe UI', sans-serif" },
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
    backBtn: { background: 'white', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 },
    
    // Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' },
    
    // Card
    card: { backgroundColor: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' },
    
    // Card Header
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' },
    roomTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a' },
    roomType: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
    
    // Status Badge
    badge: (status) => ({
      padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
      backgroundColor: status === 'Confirmed' || status === 'Checked In' ? '#dcfce7' : status === 'Cancelled' ? '#fee2e2' : '#f3f4f6',
      color: status === 'Confirmed' || status === 'Checked In' ? '#166534' : status === 'Cancelled' ? '#991b1b' : '#374151'
    }),

    // Details
    row: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569', marginBottom: '8px' },
    divider: { height: '1px', backgroundColor: '#f1f5f9', margin: '15px 0' },
    
    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: '18px', fontWeight: 'bold', color: '#0f172a' },
    dateBox: { backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#334155' }
  };

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/guest/dashboard')}>
            <ArrowLeft size={20} color="#334155"/>
        </button>
        <h1 style={styles.title}>My Reservations</h1>
      </div>

      {loading ? (
        <p style={{textAlign:'center', color:'#64748b'}}>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '100px', color: '#94a3b8'}}>
            <Calendar size={60} style={{opacity: 0.2, marginBottom: '20px'}}/>
            <h3>No bookings found</h3>
            <p>You haven't made any reservations yet.</p>
            <button onClick={() => navigate('/rooms')} style={{marginTop:'20px', padding:'10px 20px', background:'#2563eb', color:'white', border:'none', borderRadius:'10px', cursor:'pointer'}}>Book a Room</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {bookings.map((booking) => (
            <div key={booking._id} style={styles.card}>
                
                {/* Top Section */}
                <div style={styles.cardTop}>
                    <div>
                        <div style={styles.roomTitle}>Room {booking.room?.roomNumber || 'Unknown'}</div>
                        <div style={styles.roomType}>{booking.room?.type || 'Standard Room'}</div>
                    </div>
                    <span style={styles.badge(booking.status)}>{booking.status}</span>
                </div>

                {/* Dates */}
                <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                    <div style={styles.dateBox}>
                        <span style={{color:'#94a3b8', fontSize:'10px'}}>CHECK-IN</span><br/>
                        {new Date(booking.checkInDate).toLocaleDateString()}
                    </div>
                    <div style={styles.dateBox}>
                        <span style={{color:'#94a3b8', fontSize:'10px'}}>CHECK-OUT</span><br/>
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                    </div>
                </div>

                {/* Details */}
                <div style={styles.row}>
                    <MapPin size={16} color="#94a3b8"/> LuxuryStay Main Wing
                </div>
                <div style={styles.row}>
                    <FileText size={16} color="#94a3b8"/> Booking ID: <span style={{fontFamily:'monospace'}}>{booking.bookingId}</span>
                </div>

                <div style={styles.divider}></div>

                {/* Price */}
                <div style={styles.footer}>
                    <div>
                        <span style={{fontSize:'12px', color:'#94a3b8'}}>Total Paid</span>
                        <div style={styles.price}>${booking.totalAmount}</div>
                    </div>
                    {/* Digital Key (Agar active hai) */}
                    {booking.status === 'Confirmed' || booking.status === 'Checked In' ? (
                        <div style={{textAlign:'right'}}>
                            <span style={{fontSize:'10px', color:'#94a3b8', textTransform:'uppercase'}}>Digital Key</span>
                            <div style={{fontSize:'16px', fontWeight:'bold', color:'#2563eb', letterSpacing:'2px'}}>{booking.digitalKey}</div>
                        </div>
                    ) : null}
                </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;