import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Components
import PageHeader from '../../components/Layout/PageHeader';
import Loader from '../../components/UI/Loader';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  // --- 1. FETCH BOOKINGS ---
  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/bookings');
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --- 2. HANDLE STATUS CHANGE (The Fix) ---
  const handleStatusChange = async (id, newStatus) => {
    if(!window.confirm(`Mark this booking as ${newStatus}?`)) return;

    try {
        // Backend ko request bhejo
        await axios.patch(`http://localhost:5000/api/v1/bookings/${id}`, { status: newStatus });
        
        toast.success(`Booking marked as ${newStatus}`);
        fetchBookings(); // List refresh karo
    } catch (error) {
        console.error(error);
        toast.error("Failed to update status");
    }
  };

  // Filtering Logic
  const filteredData = bookings.filter(b => {
    const matchesSearch = b.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Styles
  const styles = {
    container: { padding: '30px', backgroundColor: '#f8fafc', height: 'calc(100vh - 80px)', overflowY: 'auto' },
    searchBox: { display: 'flex', gap: '10px', marginBottom: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    input: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },
    select: { padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' },
    
    tableContainer: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '15px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold', color: '#64748b' },
    td: { padding: '15px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' },
    
    badge: (status) => {
        let bg='#f3f4f6', col='#374151';
        if(status==='Confirmed') { bg='#dbeafe'; col='#1e40af'; }
        if(status==='Checked In') { bg='#dcfce7'; col='#166534'; }
        if(status==='Checked Out') { bg='#f3f4f6'; col='#4b5563'; }
        if(status==='Cancelled') { bg='#fee2e2'; col='#991b1b'; }
        return { backgroundColor: bg, color: col, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' };
    },
    
    actionSelect: { padding: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', cursor: 'pointer' }
  };

  if (loading) return <div style={{padding:50, textAlign:'center'}}><Loader size="large"/></div>;

  return (
    <div style={styles.container}>
      <PageHeader title="Bookings" subtitle="Manage reservations" />

      {/* Filters */}
      <div style={styles.searchBox}>
        <Search size={18} color="#94a3b8"/>
        <input type="text" placeholder="Search by Guest Name or Booking ID..." style={styles.input} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
        <select style={styles.select} value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>GUEST</th>
                    <th style={styles.th}>ROOM</th>
                    <th style={styles.th}>DATES</th>
                    <th style={styles.th}>STATUS</th>
                    <th style={styles.th}>ACTION</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map(b => (
                    <tr key={b._id}>
                        <td style={{...styles.td, fontFamily:'monospace', fontWeight:'bold'}}>{b.bookingId}</td>
                        <td style={{...styles.td, fontWeight:'bold'}}>{b.guestName}</td>
                        <td style={styles.td}>Room {b.room?.roomNumber}</td>
                        <td style={{...styles.td, fontSize:'12px'}}>
                            {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                            <span style={styles.badge(b.status)}>{b.status}</span>
                        </td>
                        <td style={styles.td}>
                            {/* Dropdown for Status Change */}
                            <select 
                                style={styles.actionSelect} 
                                value={b.status} 
                                onChange={(e) => handleStatusChange(b._id, e.target.value)}
                                disabled={b.status === 'Cancelled' || b.status === 'Checked Out'} // Completed ko change mat karo
                            >
                                <option value="Confirmed" disabled>Confirmed</option>
                                <option value="Checked In">Check In</option>
                                <option value="Checked Out">Check Out</option>
                                <option value="Cancelled">Cancel</option>
                            </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;