import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Star, CheckCircle, MapPin, Users, Wifi, 
  Loader, ShieldCheck, ImageOff, Phone, Mail, ChevronRight, 
  Coffee, Tv, Wind, Calendar
} from 'lucide-react';
import useAuth from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); 

  // --- STATES ---
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  // --- MOCKED IMAGES (Agar DB mein nahi hain) ---
  const roomImagesMap = {
    "101": ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"],
    "102": ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    "201": ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200", "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800"],
    "305": ["https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], 
  };
  const defaultImg = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200";

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/rooms/${id}`);
        setRoom(res.data);
      } catch (error) {
        toast.error("Room not found.");
        navigate('/rooms');
      } finally {
        setLoading(false);
      }
    };
    if(id) fetchRoom();
  }, [id, navigate]);

  // --- CALCULATION ---
  useEffect(() => {
    if (checkIn && checkOut && room) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); 
        if (diffDays > 0) {
            setNights(diffDays);
            setTotalPrice(diffDays * room.price);
        } else {
            setNights(0);
            setTotalPrice(0);
        }
    }
  }, [checkIn, checkOut, room]);

  // --- BOOKING HANDLER ---
  const handleBooking = () => {
    if (!checkIn || !checkOut) return toast.error("Select dates first.");
    if (nights <= 0) return toast.error("Check-out must be after Check-in.");
    if (!user) {
        toast("Please login to book.", { icon: '🔒' });
        navigate('/login', { state: { from: location.pathname } });
        return;
    }
    if (user.role !== 'guest') {
        toast.error("Admin/Staff cannot book rooms.");
        return;
    }
    navigate('/guest/book', { 
        state: { room: room, checkInDate: checkIn, checkOutDate: checkOut, totalAmount: totalPrice, nights: nights } 
    });
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><Loader className="animate-spin text-blue-600" size={40}/></div>;
  if (!room) return null;

  const mainImage = room.roomImages?.[0] ? `http://localhost:5000/${room.roomImages[0]}` : (roomImagesMap[room.roomNumber]?.[0] || defaultImg);
  const sideImage1 = room.roomImages?.[1] ? `http://localhost:5000/${room.roomImages[1]}` : (roomImagesMap[room.roomNumber]?.[1] || defaultImg);
  const sideImage2 = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"; // Fallback extra

  // --- STYLES (PREMIUM) ---
  const styles = {
    container: { fontFamily: "'Inter', sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' },
    
    // Navbar
    nav: { padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 50 },
    backBtn: { backgroundColor: '#f3f4f6', border: 'none', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color:'#374151', transition:'0.2s' },
    brand: { fontSize: '20px', fontWeight: '800', color: '#1e3a8a', letterSpacing: '-0.5px' },

    // Gallery
    galleryContainer: { maxWidth: '1280px', margin: '30px auto', padding: '0 20px' },
    galleryGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', height: '450px', borderRadius: '24px', overflow: 'hidden' },
    mainImg: { width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.3s' },
    sideCol: { display: 'grid', gridTemplateRows: '1fr 1fr', gap: '15px' },
    sideImg: { width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' },

    // Content Wrapper
    wrapper: { maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '60px', flexWrap: 'wrap', alignItems: 'start' },
    leftContent: { flex: 2, minWidth: '350px' },
    rightSidebar: { flex: 1, minWidth: '350px', position: 'sticky', top: '100px' },

    // Typography
    title: { fontSize: '42px', fontWeight: '800', color: '#111827', margin: '0 0 10px 0', lineHeight: '1.2' },
    typeTag: { fontSize: '14px', fontWeight: '600', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'block' },
    
    metaRow: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap' },
    badge: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#4b5563', backgroundColor:'#f3f4f6', padding:'8px 16px', borderRadius:'50px', fontWeight:'500' },
    ratingBadge: { display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: '#1e293b' },

    divider: { height: '1px', backgroundColor: '#e5e7eb', margin: '30px 0' },
    desc: { lineHeight: '1.8', color: '#4b5563', fontSize: '16px' },

    sectionTitle: { fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' },
    
    // Amenities Grid
    amenitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' },
    amenityCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', border: '1px solid #e5e7eb', color: '#374151', fontSize: '14px', fontWeight: '500' },

    // Booking Card (The Hero)
    bookingCard: { backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
    priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' },
    price: { fontSize: '32px', fontWeight: '800', color: '#111827' },
    perNight: { color: '#6b7280', fontSize: '16px' },
    
    dateBox: { border: '1px solid #d1d5db', borderRadius: '12px', overflow: 'hidden' },
    dateRow: { display: 'grid', gridTemplateColumns: '1fr 1fr' },
    dateInputWrapper: { padding: '12px', borderRight: '1px solid #d1d5db' },
    label: { fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#111827', display: 'block', marginBottom: '4px' },
    dateInput: { width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#4b5563', cursor: 'pointer' },

    summaryBox: { marginTop: '20px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#4b5563' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e5e7eb', fontSize: '18px', fontWeight: 'bold', color: '#111827' },

    bookBtn: { width: '100%', padding: '16px', background: 'linear-gradient(to right, #1e3a8a, #2563eb)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '25px', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)', transition: 'transform 0.1s' },
    disabledBtn: { background: '#9ca3af', cursor: 'not-allowed', boxShadow: 'none' },

    // Footer
    footer: { backgroundColor: '#0f172a', color: 'white', padding: '60px 0', marginTop: '80px' },
    footerContent: { maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' },
    fTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: 'white' },
    fLink: { display: 'block', color: '#94a3b8', marginBottom: '12px', textDecoration: 'none', transition: 'color 0.2s', fontSize: '14px' },
    fText: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. Navbar */}
      <nav style={styles.nav}>
        <div style={styles.brand}>LuxuryStay</div>
        <button 
            style={styles.backBtn} 
            onClick={() => navigate('/')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
            <ArrowLeft size={18}/> Back to Home
        </button>
      </nav>

      {/* 2. Gallery */}
      <div style={styles.galleryContainer}>
        <div style={styles.galleryGrid}>
            <img src={mainImage} style={styles.mainImg} alt="Room Main" />
            <div style={styles.sideCol}>
                <img src={sideImage1} style={styles.sideImg} alt="Side 1" />
                <img src={sideImage2} style={styles.sideImg} alt="Side 2" />
            </div>
        </div>
      </div>

      <div style={styles.wrapper}>
        
        {/* LEFT: Details */}
        <div style={styles.leftContent}>
            <span style={styles.typeTag}>{room.type} Suite</span>
            <h1 style={styles.title}>Room {room.roomNumber}</h1>
            
            <div style={styles.metaRow}>
                <div style={styles.ratingBadge}><Star size={18} fill="#f59e0b" color="#f59e0b"/> 4.9 (128 Reviews)</div>
                <span style={styles.badge}><MapPin size={16}/> Main Wing</span>
                <span style={styles.badge}><Users size={16}/> {room.capacity} Guests</span>
                {room.currentStatus === 'Available' 
                    ? <span style={{...styles.badge, color:'#166534', background:'#dcfce7'}}><CheckCircle size={16}/> Available</span>
                    : <span style={{...styles.badge, color:'#991b1b', background:'#fee2e2'}}>Booked</span>
                }
            </div>

            <div style={styles.divider}></div>

            <div style={styles.sectionTitle}>About this place</div>
            <p style={styles.desc}>
                {room.description || "Immerse yourself in elegance. This room features floor-to-ceiling windows, a plush king-size bed, and a marble bathroom with a rain shower. Perfect for both leisure and business travelers seeking comfort and style."}
            </p>

            <div style={styles.divider}></div>

            <div style={styles.sectionTitle}>What this room offers</div>
            <div style={styles.amenitiesGrid}>
                {(room.amenities.length > 0 ? room.amenities : ["Free High-Speed WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Room Service", "Safe"]).map((am, i) => (
                    <div key={i} style={styles.amenityCard}>
                        {am.includes("Wifi") ? <Wifi size={20}/> : am.includes("TV") ? <Tv size={20}/> : am.includes("Coffee") ? <Coffee size={20}/> : <ShieldCheck size={20}/>}
                        {am}
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT: Booking Card */}
        <div style={styles.rightSidebar}>
            <div style={styles.bookingCard}>
                <div style={styles.priceRow}>
                    <div><span style={styles.price}>${room.price}</span> <span style={styles.perNight}>/ night</span></div>
                </div>

                <div style={styles.dateBox}>
                    <div style={styles.dateRow}>
                        <div style={styles.dateInputWrapper}>
                            <label style={styles.label}>CHECK-IN</label>
                            <input type="date" style={styles.dateInput} min={today} onChange={(e) => setCheckIn(e.target.value)} />
                        </div>
                        <div style={{padding:'12px'}}>
                            <label style={styles.label}>CHECKOUT</label>
                            <input type="date" style={styles.dateInput} min={checkIn || today} onChange={(e) => setCheckOut(e.target.value)} />
                        </div>
                    </div>
                </div>

                {nights > 0 ? (
                    <div style={styles.summaryBox}>
                        <div style={styles.summaryRow}><span>${room.price} x {nights} nights</span><span>${totalPrice}</span></div>
                        <div style={styles.summaryRow}><span>Cleaning Fee</span><span>$20</span></div>
                        <div style={styles.summaryRow}><span>Service Fee</span><span>$15</span></div>
                        <div style={styles.totalRow}><span>Total</span><span>${totalPrice + 35}</span></div>
                    </div>
                ) : (
                    <div style={{marginTop:'20px', textAlign:'center', color:'#9ca3af', fontSize:'14px'}}>
                        <Calendar size={40} style={{opacity:0.2, marginBottom:'10px'}}/>
                        <p>Add dates to see pricing</p>
                    </div>
                )}

                <button 
                    style={{...styles.bookBtn, ...(nights <= 0 || room.currentStatus !== 'Available' ? styles.disabledBtn : {})}} 
                    onClick={handleBooking}
                    disabled={nights <= 0 || room.currentStatus !== 'Available'}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                    {room.currentStatus === 'Available' ? (nights > 0 ? "Reserve Now" : "Check Availability") : "Sold Out"}
                </button>
            </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
            <div>
                <div style={{fontSize:'24px', fontWeight:'bold', marginBottom:'20px'}}>LuxuryStay</div>
                <p style={styles.fText}>Experience the pinnacle of luxury and hospitality. Your comfort is our priority.</p>
            </div>
            <div>
                <div style={styles.fTitle}>Explore</div>
                <a href="/" style={styles.fLink}>Home</a>
                <a href="/rooms" style={styles.fLink}>All Rooms</a>
                <a href="/about" style={styles.fLink}>About Us</a>
            </div>
            <div>
                <div style={styles.fTitle}>Contact</div>
                <p style={styles.fLink}><Phone size={16} style={{display:'inline', marginRight:5}}/> +1 234 567 890</p>
                <p style={styles.fLink}><Mail size={16} style={{display:'inline', marginRight:5}}/> support@luxurystay.com</p>
                <p style={styles.fLink}><MapPin size={16} style={{display:'inline', marginRight:5}}/> Beverly Hills, CA</p>
            </div>
        </div>
        <div style={{textAlign:'center', marginTop:'50px', borderTop:'1px solid #1e293b', paddingTop:'20px', color:'#64748b', fontSize:'13px'}}>
            © 2025 LuxuryStay Hospitality. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default RoomDetails;