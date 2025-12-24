import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { roomAPI } from '../../api/roomAPI';
import PageHeader from '../../components/Layout/PageHeader';
import Loader from '../../components/UI/Loader';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import { BedDouble, Users, Wind, Wifi, Tv, PenTool, CalendarClock, History } from 'lucide-react';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { execute, loading, data: room } = useAxios();
  // const { execute: updateStatus } = useAxios(); // For status updates

  useEffect(() => {
    execute(roomAPI.getRoomById, id);
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    // API call needed here to update status
    toast.success(`Status updated to ${newStatus}`);
    // Refresh room data logic...
  };

  const navigateToMaintenance = () => {
    navigate('/maintenance/log', { state: { roomId: room.roomNumber } });
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}><Loader /></div>;
  if (!room) return <div style={{ padding: '50px', textAlign: 'center' }}>Room not found</div>;

  // --- STYLES ---
  const styles = {
    wrapper: { width: '100%', paddingBottom: '50px' },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }, // Left: Details, Right: Actions
    
    // Image Section
    imageContainer: { height: '350px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e2e8f0', marginBottom: '20px', position: 'relative' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    
    // Info Card
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: '20px' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
    roomTitle: { fontSize: '28px', fontWeight: '800', color: '#111827', margin: 0 },
    price: { fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a' },
    
    // Status Badge
    statusBadge: (status) => ({
        padding: '6px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold',
        backgroundColor: status === 'Available' ? '#dcfce7' : status === 'Occupied' ? '#fee2e2' : '#fef9c3',
        color: status === 'Available' ? '#15803d' : status === 'Occupied' ? '#b91c1c' : '#a16207'
    }),

    // Details Grid
    metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '15px', fontWeight: '500' },
    
    // Amenities
    amenitiesTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#334155' },
    amenitiesList: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    tag: { padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '13px', color: '#475569', border: '1px solid #e2e8f0' },

    // Sidebar Actions
    sidebar: { display: 'flex', flexDirection: 'column', gap: '20px' },
    actionCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    sidebarTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
    actionBtn: { width: '100%', marginBottom: '10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }
  };

  return (
    <div style={styles.wrapper}>
      <PageHeader title="Room Details" breadcrumbs={['Rooms', room.roomNumber]} />

      <div style={styles.grid}>
        
        {/* LEFT COLUMN: DETAILS */}
        <div>
            <div style={styles.imageContainer}>
                {room.roomImages?.[0] ? 
                    <img src={room.roomImages[0]} alt="Room" style={styles.img} /> : 
                    <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>No Image Available</div>
                }
            </div>

            <div style={styles.card}>
                <div style={styles.headerRow}>
                    <div>
                        <h1 style={styles.roomTitle}>Room {room.roomNumber}</h1>
                        <span style={{color: '#64748b'}}>{room.type} Suite</span>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <div style={styles.price}>${room.price}<span style={{fontSize:'14px', color:'#94a3b8', fontWeight:'normal'}}>/night</span></div>
                        <span style={styles.statusBadge(room.currentStatus)}>{room.currentStatus}</span>
                    </div>
                </div>

                <div style={styles.metaGrid}>
                    <div style={styles.metaItem}><Users size={18}/> {room.capacity} Guests</div>
                    <div style={styles.metaItem}><BedDouble size={18}/> King Size Bed</div> {/* Mock data based on desc */}
                    <div style={styles.metaItem}><Wind size={18}/> Air Conditioned</div>
                    <div style={styles.metaItem}><Wifi size={18}/> High-Speed WiFi</div>
                </div>

                <p style={{lineHeight: '1.6', color: '#334155', marginBottom: '30px'}}>{room.description}</p>

                <div>
                    <h3 style={styles.amenitiesTitle}>Amenities & Features</h3>
                    <div style={styles.amenitiesList}>
                        {room.amenities?.map(am => <span key={am} style={styles.tag}>{am}</span>)}
                        {/* Fallback if empty */}
                        {(!room.amenities || room.amenities.length === 0) && <span style={{color:'#999'}}>No specific amenities listed.</span>}
                    </div>
                </div>
            </div>

            {/* Booking History Stub */}
            <div style={styles.card}>
                <h3 style={styles.amenitiesTitle}><History size={18} style={{verticalAlign:'text-bottom'}}/> Recent Booking History</h3>
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
                    <thead>
                        <tr style={{textAlign: 'left', borderBottom: '1px solid #eee'}}>
                            <th style={{padding: '10px'}}>Guest</th>
                            <th style={{padding: '10px'}}>Check-In</th>
                            <th style={{padding: '10px'}}>Check-Out</th>
                            <th style={{padding: '10px'}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan="4" style={{padding: '20px', textAlign: 'center', color:'#999'}}>No recent history available.</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS */}
        <div style={styles.sidebar}>
            
            {/* Quick Actions */}
            <div style={styles.actionCard}>
                <h4 style={styles.sidebarTitle}>Manage Status</h4>
                <Button variant="outline" style={styles.actionBtn} onClick={() => handleStatusChange('Cleaning')}>
                    <PenTool size={16}/> Mark for Cleaning
                </Button>
                <Button variant="outline" style={{...styles.actionBtn, borderColor: '#fcd34d', color: '#b45309'}} onClick={navigateToMaintenance}>
                    <PenTool size={16}/> Report Maintenance
                </Button>
                <Button style={{...styles.actionBtn, marginTop: '10px', justifyContent:'center'}} onClick={() => navigate(`/rooms/edit/${room._id}`)}>
                    Edit Room Details
                </Button>
            </div>

            {/* Housekeeping Info */}
            <div style={styles.actionCard}>
                <h4 style={styles.sidebarTitle}>Housekeeping</h4>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px'}}>
                    <span style={{color: '#64748b'}}>Last Cleaned:</span>
                    <span style={{fontWeight: 'bold'}}>Today, 10 AM</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                    <span style={{color: '#64748b'}}>Housekeeper:</span>
                    <span>Sarah J.</span>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default RoomDetail;