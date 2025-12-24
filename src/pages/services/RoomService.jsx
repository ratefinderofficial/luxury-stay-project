import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coffee, CheckCircle, Clock, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomService = () => {
  const [orders, setOrders] = useState([]);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Update Status
  const handleStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/orders/${id}`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const styles = {
    container: { padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Segoe UI' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
    room: { fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a' },
    badge: (status) => ({
        padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
        backgroundColor: status === 'Delivered' ? '#dcfce7' : status === 'Preparing' ? '#fef9c3' : '#fee2e2',
        color: status === 'Delivered' ? '#166534' : status === 'Preparing' ? '#854d0e' : '#991b1b'
    }),
    itemRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px', color: '#475569' },
    total: { marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' },
    btnGroup: { display: 'flex', gap: '10px', marginTop: '15px' },
    btn: { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'white' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{fontSize:'28px', fontWeight:'bold', marginBottom:'30px', color:'#1e293b'}}>Room Service Orders</h1>
      
      <div style={styles.grid}>
        {orders.map(order => (
            <div key={order._id} style={styles.card}>
                <div style={styles.header}>
                    <span style={styles.room}>Room {order.roomNumber}</span>
                    <span style={styles.badge(order.status)}>{order.status}</span>
                </div>
                
                <div>
                    {order.items.map((item, i) => (
                        <div key={i} style={styles.itemRow}>
                            <span>{item.name}</span>
                            <span>${item.price}</span>
                        </div>
                    ))}
                </div>

                <div style={styles.total}>
                    <span>Total Amount</span>
                    <span>${order.totalAmount}</span>
                </div>

                {/* Actions */}
                {order.status !== 'Delivered' && (
                    <div style={styles.btnGroup}>
                        {order.status === 'Pending' && (
                            <button onClick={() => handleStatus(order._id, 'Preparing')} style={{...styles.btn, backgroundColor:'#d97706'}}>
                                <Utensils size={16} style={{verticalAlign:'middle'}}/> Prepare
                            </button>
                        )}
                        <button onClick={() => handleStatus(order._id, 'Delivered')} style={{...styles.btn, backgroundColor:'#16a34a'}}>
                            <CheckCircle size={16} style={{verticalAlign:'middle'}}/> Deliver
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default RoomService;