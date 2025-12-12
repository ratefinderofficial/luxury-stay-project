import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  DollarSign, Users, BedDouble, Calendar, 
  Plus, Activity 
} from 'lucide-react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Components
import Loader from '../../components/UI/Loader';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/reports/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error("Dashboard API Error:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // --- STYLES (Scroll Added) ---
  const styles = {
    container: { 
        width: '210%', 
        padding: '30px', 
        backgroundColor: '#f8fafc', 
        fontFamily: "'Segoe UI', sans-serif",
        boxSizing: 'border-box',
        
        // 👇 SCROLL FIX YAHAN HAI
        height: '100vh',       // Full Screen Height
        overflowY: 'auto',     // Vertical Scroll Enable
        paddingBottom: '100px' // Thoda extra space neeche taake content cut na ho
    },
    
    // Header
    header: { marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 },
    subTitle: { color: '#64748b', marginTop: '5px' },
    actionBtn: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)' },

    // Cards Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' },
    
    // KPI Card
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardLabel: { fontSize: '14px', color: '#64748b', fontWeight: '600' },
    cardValue: { fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' },
    iconBox: (bg, color) => ({ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }),

    // Main Section (Graph + Recent)
    mainSection: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' },
    
    // Chart Card
    chartCard: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: '400px' },
    
    // Recent Bookings List
    listCard: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9' },
    listName: { fontWeight: 'bold', color: '#334155', fontSize: '14px' },
    listDate: { fontSize: '12px', color: '#94a3b8' },
    statusBadge: (status) => ({
        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
        backgroundColor: status === 'Confirmed' ? '#dcfce7' : '#fee2e2',
        color: status === 'Confirmed' ? '#166534' : '#991b1b'
    })
  };

  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Loader size="large"/></div>;

  // Fallback Data
  const data = stats || { totalRevenue: 0, totalBookings: 0, occupancyRate: 0, totalRooms: 0, recentBookings: [] };
  
  // Graph Data
  const graphData = [
    { name: 'Jan', income: 4000 }, { name: 'Feb', income: 3000 },
    { name: 'Mar', income: 5000 }, { name: 'Apr', income: 4500 },
    { name: 'May', income: 6000 }, { name: 'Jun', income: data.totalRevenue || 7000 },
  ];

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subTitle}>Overview for {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <button style={styles.actionBtn} onClick={() => navigate('/bookings/new')}>
            <Plus size={18}/> New Booking
        </button>
      </div>

      {/* --- KPI CARDS --- */}
      <div style={styles.grid}>
        
        {/* Revenue */}
        <div style={styles.card}>
            <div>
                <p style={styles.cardLabel}>Total Revenue</p>
                <h3 style={styles.cardValue}>${data.totalRevenue?.toLocaleString()}</h3>
            </div>
            <div style={styles.iconBox('#dcfce7', '#16a34a')}><DollarSign size={24}/></div>
        </div>

        {/* Bookings */}
        <div style={styles.card}>
            <div>
                <p style={styles.cardLabel}>Total Bookings</p>
                <h3 style={styles.cardValue}>{data.totalBookings}</h3>
            </div>
            <div style={styles.iconBox('#dbeafe', '#2563eb')}><Calendar size={24}/></div>
        </div>

        {/* Occupancy */}
        <div style={styles.card}>
            <div>
                <p style={styles.cardLabel}>Occupancy Rate</p>
                <h3 style={styles.cardValue}>{data.occupancyRate || 0}%</h3>
            </div>
            <div style={styles.iconBox('#fef3c7', '#d97706')}><Activity size={24}/></div>
        </div>

        {/* Rooms */}
        <div style={styles.card}>
            <div>
                <p style={styles.cardLabel}>Total Rooms</p>
                <h3 style={styles.cardValue}>{data.totalRooms}</h3>
            </div>
            <div style={styles.iconBox('#f3e8ff', '#9333ea')}><BedDouble size={24}/></div>
        </div>
      </div>

      {/* --- MAIN CONTENT (Chart & Recent List) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: REVENUE CHART */}
        <div className="lg:col-span-2" style={styles.chartCard}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h3 style={{fontWeight:'bold', color:'#1e293b'}}>Revenue Overview</h3>
            </div>
            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                    <AreaChart data={graphData}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value}`}/>
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                        <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* RIGHT: RECENT BOOKINGS */}
        <div style={styles.listCard}>
            <h3 style={{fontWeight:'bold', color:'#1e293b', marginBottom:'20px'}}>Recent Bookings</h3>
            
            {data.recentBookings && data.recentBookings.length > 0 ? (
                data.recentBookings.map((booking) => (
                    <div key={booking._id} style={styles.listItem}>
                        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                            <div style={{width:'35px', height:'35px', borderRadius:'50%', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', color:'#64748b'}}>
                                {booking.guestName ? booking.guestName.charAt(0) : 'G'}
                            </div>
                            <div>
                                <div style={styles.listName}>{booking.guestName || 'Guest'}</div>
                                <div style={styles.listDate}>Room {booking.room?.roomNumber || 'N/A'}</div>
                            </div>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <span style={styles.statusBadge(booking.status)}>{booking.status}</span>
                            <div style={{fontSize:'12px', color:'#94a3b8', marginTop:'4px'}}>${booking.totalAmount}</div>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{color:'#94a3b8', textAlign:'center', marginTop:'50px'}}>No recent bookings</p>
            )}

            <button onClick={() => navigate('/bookings')} style={{width:'100%', marginTop:'20px', padding:'12px', border:'1px solid #e2e8f0', background:'transparent', borderRadius:'10px', cursor:'pointer', color:'#2563eb', fontWeight:'bold'}}>
                View All Bookings
            </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;