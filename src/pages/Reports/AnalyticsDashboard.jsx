import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, BedDouble, TrendingUp, Calendar } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/reports/dashboard')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // --- STYLES (Clean & Premium) ---
  const styles = {
    container: {
      width: '230%',
      padding: '30px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      height: 'calc(100vh - 80px)',
      overflowY: 'auto'
    },
    header: { marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: '800', color: '#1e293b' },
    subtitle: { color: '#64748b', marginTop: '5px' },
    
    // Grid for KPI Cards
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    card: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      border: '1px solid #e2e8f0'
    },
    iconBox: (color) => ({
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color,
      color: 'white'
    }),
    cardTitle: { fontSize: '14px', color: '#64748b', fontWeight: '600' },
    cardValue: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' },

    // Charts Section
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '25px'
    },
    chartCard: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      minHeight: '400px'
    },
    chartTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Loading Analytics...</div>;

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Analytics & Reports</h1>
        <p style={styles.subtitle}>Overview of hotel performance and key metrics.</p>
      </div>

      {/* --- KPI CARDS --- */}
      <div style={styles.grid}>
        
        {/* Revenue Card */}
        <div style={styles.card}>
            <div style={styles.iconBox('#10b981')}> <DollarSign size={24}/> </div>
            <div>
                <div style={styles.cardTitle}>Total Revenue</div>
                <div style={styles.cardValue}>${stats?.totalRevenue?.toLocaleString()}</div>
            </div>
        </div>

        {/* Bookings Card */}
        <div style={styles.card}>
            <div style={styles.iconBox('#3b82f6')}> <Calendar size={24}/> </div>
            <div>
                <div style={styles.cardTitle}>Total Bookings</div>
                <div style={styles.cardValue}>{stats?.totalBookings}</div>
            </div>
        </div>

        {/* Occupancy Card */}
        <div style={styles.card}>
            <div style={styles.iconBox('#f59e0b')}> <TrendingUp size={24}/> </div>
            <div>
                <div style={styles.cardTitle}>Occupancy Rate</div>
                <div style={styles.cardValue}>{stats?.occupancyRate}%</div>
            </div>
        </div>

        {/* Room Status Card */}
        <div style={styles.card}>
            <div style={styles.iconBox('#6366f1')}> <BedDouble size={24}/> </div>
            <div>
                <div style={styles.cardTitle}>Total Rooms</div>
                <div style={styles.cardValue}>12</div>
            </div>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div style={styles.chartsGrid}>
        
        {/* 1. Revenue Chart (Bar) */}
        <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Revenue Overview (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill:'#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* 2. Room Status Chart (Pie) */}
        <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Current Room Status</h3>
            <div style={{height: '300px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={stats?.roomStats}
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {stats?.roomStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div style={{display:'flex', justifyContent:'center', gap:'20px', marginTop:'-20px'}}>
                {stats?.roomStats.map((item) => (
                    <div key={item.name} style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'14px', color:'#64748b'}}>
                        <div style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor: item.color}}></div>
                        {item.name}: {item.value}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;