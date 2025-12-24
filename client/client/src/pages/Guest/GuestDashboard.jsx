import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Calendar, User, LogOut, Bell, Wifi, 
  Sparkles, Wrench, FileText, Coffee, X, 
  Download, ChevronRight 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const GuestDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [modalType, setModalType] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState({ details: '', category: 'Daily Cleaning' });
  const [foodOrder, setFoodOrder] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [myBill, setMyBill] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchBooking = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/bookings/my-bookings?email=${user.email}`);
        if (res.data && res.data.length > 0) {
            const latest = res.data[0];
            setActiveBooking({
                roomNumber: latest.room?.roomNumber || "N/A",
                wifiPassword: "LuxGuest2025",
                checkOutDate: new Date(latest.checkOutDate).toDateString(),
                type: latest.room?.type || "Standard Room",
                status: latest.status
            });
        }
      } catch (err) { console.error(err); }
    };
    fetchBooking();
  }, [user]);

  // --- NOTIFICATIONS ---
  useEffect(() => {
    const socket = io("http://localhost:5000"); 
    socket.on("notification", (data) => {
      if (activeBooking && data.room === activeBooking.roomNumber) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
        toast.success(data.message, { duration: 6000, icon: '🔔' });
      }
    });
    return () => socket.disconnect();
  }, [activeBooking]);

  // --- ACTIONS ---
  const handleHomeClick = () => navigate('/');
  const handleLogout = () => { if (window.confirm("Logout?")) { logout(); navigate('/login'); }};

  const fetchMyBill = async () => {
    if(!activeBooking) return toast.error("No active booking");
    setModalType('billing');
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/billing/room/${activeBooking.roomNumber}`);
      setMyBill(res.data);
    } catch (err) { setMyBill(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalType === 'cleaning') {
        await axios.post('http://localhost:5000/api/v1/housekeeping', {
          roomNumber: activeBooking.roomNumber,
          taskType: requestData.category,
          instructions: requestData.details || "Guest requested",
          assignedTo: "Unassigned", status: 'Pending'
        });
        toast.success("Service Requested!");
      } 
      else if (modalType === 'maintenance') {
        await axios.post('http://localhost:5000/api/v1/maintenance', {
          roomNumber: activeBooking.roomNumber,
          issue: requestData.details,
          priority: 'Medium', status: 'Pending', reportedBy: 'Guest'
        });
        toast.success("Report Sent!");
      }
      else if (modalType === 'food') {
        await new Promise(r => setTimeout(r, 1000));
        toast.success("Order Sent to Kitchen!");
        setFoodOrder([]);
      }
      setModalType(null);
    } catch (err) { toast.error("Request Failed"); }
    finally { setLoading(false); }
  };

  const toggleFoodItem = (item) => {
    if (foodOrder.find(i => i.id === item.id)) setFoodOrder(foodOrder.filter(i => i.id !== item.id));
    else setFoodOrder([...foodOrder, item]);
  };

  const foodMenu = [
    { id: 1, name: "Club Sandwich", price: 12, desc: "Classic chicken & egg" },
    { id: 2, name: "Zinger Burger", price: 15, desc: "Crispy chicken patty" },
    { id: 3, name: "Pepperoni Pizza", price: 18, desc: "Italian style" },
    { id: 4, name: "Latte / Coffee", price: 5, desc: "Freshly brewed" }
  ];

  // --- ✨ PREMIUM STYLES (App-Like Look) ---
  const styles = {
    // 1. Page Background (Soft Gray)
    container: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", paddingBottom: '90px' },

    // 2. Header Section (Curved Blue Gradient)
    header: { 
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', 
        padding: '30px 25px 100px 25px', // Neeche padding zyada di hai overlap ke liye
        borderBottomLeftRadius: '40px', 
        borderBottomRightRadius: '40px',
        color: 'white',
        position: 'relative'
    },
    navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    logo: { fontSize: '20px', fontWeight: '800', letterSpacing: '1px' },
    iconBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' },
    
    welcomeTitle: { fontSize: '28px', fontWeight: '700', margin: 0 },
    subTitle: { opacity: 0.8, fontSize: '14px', marginTop: '5px' },

    // 3. Floating Card (Overlaps Header)
    roomCard: { 
        backgroundColor: 'white', 
        width: '85%', maxWidth: '500px', margin: '-70px auto 30px auto', 
        borderRadius: '24px', padding: '25px', 
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.15)', // Deep Shadow
        position: 'relative', zIndex: 10
    },
    roomHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    roomLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' },
    roomNumber: { fontSize: '42px', fontWeight: '800', color: '#1e3a8a', lineHeight: 1, marginTop: '5px' },
    badge: { background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },

    infoRow: { display: 'flex', gap: '15px' },
    infoBox: { flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '5px' },
    infoVal: { fontWeight: '700', color: '#334155', fontSize: '15px' },
    infoKey: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase' },

    // 4. Services Grid
    sectionTitle: { padding: '0 25px', fontSize: '18px', fontWeight: 'bold', color: '#334155', marginBottom: '15px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', padding: '0 25px', maxWidth: '600px', margin: '0 auto' },
    
    serviceBtn: { 
        backgroundColor: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)', cursor: 'pointer', border: '1px solid #ffffff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        transition: 'transform 0.2s'
    },
    iconCircle: (color, bg) => ({ width: '50px', height: '50px', borderRadius: '18px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    serviceText: { fontSize: '14px', fontWeight: '600', color: '#374151' },

    // 5. Bottom Nav (Floating Style)
    bottomNav: { 
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: '400px', background: '#1e293b', 
        display: 'flex', justifyContent: 'space-around', padding: '15px 0',
        borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 40 
    },
    navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', fontSize: '10px', color: '#94a3b8', cursor: 'pointer', background:'none', border:'none' },
    activeNav: { color: 'white', fontWeight: 'bold' },

    // Modal
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'end', zIndex: 100 },
    modal: { backgroundColor: 'white', width: '100%', maxWidth: '500px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '30px', maxHeight: '85vh', overflowY: 'auto' },
    input: { width: '100%', padding: '15px', borderRadius: '14px', border: '1px solid #e2e8f0', marginTop: '10px', fontSize: '14px', background: '#f8fafc', outline: 'none', boxSizing:'border-box' },
    submitBtn: { width: '100%', background: '#2563eb', color: 'white', padding: '15px', borderRadius: '14px', border: 'none', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer', fontSize: '16px' }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. Header (Blue Area) */}
      <div style={styles.header}>
        <div style={styles.navRow}>
            <button style={styles.iconBtn} onClick={handleHomeClick} title="Home"><Home size={20}/></button>
            <div style={styles.logo}>LuxuryStay</div>
            <button style={styles.iconBtn}><Bell size={20}/></button>
        </div>
        
        <div>
            <h1 style={styles.welcomeTitle}>Hi, {user?.name?.split(' ')[0] || 'Guest'}</h1>
            <p style={styles.subTitle}>Here is your stay overview.</p>
        </div>
      </div>

      {/* 2. Floating Room Card */}
      <div style={styles.roomCard}>
        {activeBooking ? (
            <>
                <div style={styles.roomHeader}>
                    <div>
                        <div style={styles.roomLabel}>Current Room</div>
                        <div style={styles.roomNumber}>{activeBooking.roomNumber}</div>
                        <div style={{fontSize:'13px', color:'#64748b'}}>{activeBooking.type}</div>
                    </div>
                    <div style={styles.badge}>Checked In</div>
                </div>

                <div style={styles.infoRow}>
                    <div style={styles.infoBox}>
                        <div style={styles.infoKey}>Wi-Fi Password</div>
                        <div style={{display:'flex', alignItems:'center', gap:'5px', ...styles.infoVal}}>
                            <Wifi size={16} color="#2563eb"/> {activeBooking.wifiPassword}
                        </div>
                    </div>
                    <div style={styles.infoBox}>
                        <div style={styles.infoKey}>Check Out</div>
                        <div style={{display:'flex', alignItems:'center', gap:'5px', ...styles.infoVal}}>
                            <Calendar size={16} color="#dc2626"/> {activeBooking.checkOutDate.split(',')[0]}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div style={{textAlign:'center', padding:'20px 0'}}>
                <h3 style={{margin:'0 0 10px 0', color:'#1e293b'}}>No Active Booking</h3>
                <p style={{color:'#64748b', fontSize:'14px', marginBottom:'20px'}}>Ready for your next luxury experience?</p>
                <button onClick={() => navigate('/rooms')} style={styles.submitBtn}>Book Now</button>
            </div>
        )}
      </div>

      {/* 3. Services Grid */}
      <div style={styles.sectionTitle}>Concierge Services</div>
      <div style={styles.grid}>
        
        <div style={styles.serviceBtn} onClick={() => { activeBooking ? setModalType('cleaning') : toast.error("Check-in first"); }}>
            <div style={styles.iconCircle('#2563eb', '#eff6ff')}><Sparkles size={24}/></div>
            <span style={styles.serviceText}>Room Cleaning</span>
        </div>

        <div style={styles.serviceBtn} onClick={() => { activeBooking ? setModalType('maintenance') : toast.error("Check-in first"); }}>
            <div style={styles.iconCircle('#ea580c', '#fff7ed')}><Wrench size={24}/></div>
            <span style={styles.serviceText}>Maintenance</span>
        </div>

        <div style={styles.serviceBtn} onClick={fetchMyBill}>
            <div style={styles.iconCircle('#16a34a', '#f0fdf4')}><FileText size={24}/></div>
            <span style={styles.serviceText}>My Invoice</span>
        </div>

        <div style={styles.serviceBtn} onClick={() => setModalType('food')}>
            <div style={styles.iconCircle('#db2777', '#fdf2f8')}><Coffee size={24}/></div>
            <span style={styles.serviceText}>Order Food</span>
        </div>

      </div>

      {/* 4. Bottom Floating Nav */}
      <div style={styles.bottomNav}>
        <button style={{...styles.navItem, ...styles.activeNav}} onClick={() => window.scrollTo(0,0)}>
            <Home size={22}/> <span style={{fontSize:'9px', marginTop:2}}>Home</span>
        </button>
        <button style={styles.navItem} onClick={() => navigate('/guest/bookings')}>
            <Calendar size={22}/> <span style={{fontSize:'9px', marginTop:2}}>Bookings</span>
        </button>
        <button style={styles.navItem} onClick={() => navigate('/guest/profile')}>
            <User size={22}/> <span style={{fontSize:'9px', marginTop:2}}>Profile</span>
        </button>
        <button style={styles.navItem} onClick={handleLogout}>
            <LogOut size={22} color="#ef4444"/> <span style={{fontSize:'9px', marginTop:2, color:'#ef4444'}}>Logout</span>
        </button>
      </div>

      {/* --- MODALS --- */}
      {modalType && (
        <div style={styles.overlay} onClick={(e) => { if(e.target === e.currentTarget) setModalType(null) }}>
            <div style={styles.modal}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px'}}>
                    <h2 style={{fontSize:'20px', fontWeight:'800', margin:0, color:'#1e293b'}}>
                        {modalType === 'cleaning' ? '🧹 Housekeeping' : modalType === 'maintenance' ? '🔧 Repair Issue' : modalType === 'billing' ? '🧾 Your Bill' : '🍔 Room Service'}
                    </h2>
                    <button onClick={() => setModalType(null)} style={{background:'#f3f4f6', border:'none', borderRadius:'50%', width:'35px', height:'35px', cursor:'pointer'}}><X size={18}/></button>
                </div>

                {modalType === 'cleaning' && (
                    <form onSubmit={handleSubmit}>
                        <label style={{fontSize:'13px', fontWeight:'600', color:'#4b5563'}}>Service Type</label>
                        <select style={styles.input} value={requestData.category} onChange={e => setRequestData({...requestData, category: e.target.value})}>
                            <option>Daily Cleaning</option><option>Extra Towels</option><option>Laundry Pickup</option>
                        </select>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>Request Service</button>
                    </form>
                )}

                {modalType === 'maintenance' && (
                    <form onSubmit={handleSubmit}>
                        <label style={{fontSize:'13px', fontWeight:'600', color:'#4b5563'}}>Issue</label>
                        <textarea style={{...styles.input, height:'100px'}} required value={requestData.details} onChange={e => setRequestData({...requestData, details: e.target.value})} />
                        <button type="submit" style={styles.submitBtn} disabled={loading}>Report Issue</button>
                    </form>
                )}

                {modalType === 'billing' && (
                    <div>
                        {myBill ? (
                            <div style={{background:'#f8fafc', padding:'20px', borderRadius:'16px'}}>
                                <div style={{fontSize:'12px', color:'#64748b', marginBottom:'10px'}}>INVOICE #{myBill.invoiceNumber || 'NEW'}</div>
                                {myBill.items.map((item, i) => (
                                    <div key={i} style={{display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'14px', color:'#334155'}}>
                                        <span>{item.description}</span><strong>${item.amount}</strong>
                                    </div>
                                ))}
                                <div style={{borderTop:'1px solid #e2e8f0', margin:'15px 0'}}></div>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize:'18px', fontWeight:'800', color:'#1e3a8a'}}>
                                    <span>Total</span><span>${myBill.totalAmount}</span>
                                </div>
                            </div>
                        ) : <p style={{textAlign:'center', color:'#94a3b8', padding:'20px'}}>No active bill.</p>}
                        
                        {myBill && <button style={{...styles.submitBtn, background:'#16a34a'}} onClick={() => toast.success("Downloaded!")}><Download size={18} style={{display:'inline', marginRight:5}}/> Download PDF</button>}
                    </div>
                )}

                {modalType === 'food' && (
                    <form onSubmit={handleSubmit}>
                        {foodMenu.map(item => (
                            <div key={item.id} onClick={() => toggleFoodItem(item)} style={{display:'flex', justifyContent:'space-between', padding:'15px', borderBottom:'1px solid #f3f4f6', alignItems:'center', cursor:'pointer', background: foodOrder.find(i=>i.id===item.id)?'#eff6ff':'white'}}>
                                <div><div style={{fontWeight:'bold', color:'#334155'}}>{item.name}</div><div style={{fontSize:'12px', color:'#94a3b8'}}>{item.desc}</div></div>
                                <div style={{fontWeight:'bold', color:'#1e3a8a'}}>${item.price}</div>
                            </div>
                        ))}
                        <button type="submit" style={styles.submitBtn} disabled={loading}>Place Order (${foodOrder.reduce((sum,i)=>sum+i.price,0)})</button>
                    </form>
                )}
            </div>
        </div>
      )}

    </div>
  );
};

export default GuestDashboard;