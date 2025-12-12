import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Star, Users, Wifi, Wind, Loader, Ban, Home, ArrowLeft } from 'lucide-react';

const PublicRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // --- 1. FETCH REAL ROOMS ---
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/rooms');
        const roomData = Array.isArray(res.data) ? res.data : (res.data.rooms || []);
        setRooms(roomData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // --- 2. IMAGE MAPPING HELPER ---
  const getRoomImage = (room) => {
    if (room.roomImages && room.roomImages.length > 0 && !room.roomImages[0].includes("placeholder")) {
        return `http://localhost:5000/${room.roomImages[0]}`;
    }
    switch (room.type) {
        case 'Deluxe': return "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800";
        case 'Suite': return "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800";
        case 'Luxury': return "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800";
        case 'Penthouse': return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800";
        default: return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800";
    }
  };

  // Filter Logic
  const filteredRooms = filter === 'All' ? rooms : rooms.filter(room => room.type === filter);

  // --- ULTRA PREMIUM STYLES ---
  const styles = {
    container: { fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' },
    
    // 1. Navigation Bar (Back Button)
    nav: { 
        position: 'absolute', top: 0, width: '100%', padding: '20px 5%', zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    backBtn: { 
        display: 'flex', alignItems: 'center', gap: '8px', 
        backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)',
        color: 'white', border: '1px solid rgba(255,255,255,0.3)', 
        padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: '600',
        transition: 'all 0.3s'
    },
    brand: { color: 'white', fontSize: '24px', fontWeight: '800', letterSpacing: '1px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' },

    // 2. Cinematic Hero Section
    hero: { 
        position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px', overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    },
    overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(15, 23, 42, 0.9))' },
    heroContent: { position: 'relative', zIndex: 10, color: 'white', maxWidth: '800px', padding: '0 20px' },
    title: { fontSize: '56px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px', textShadow: '0 4px 20px rgba(0,0,0,0.3)' },
    sub: { fontSize: '18px', opacity: 0.9, fontWeight: '300', letterSpacing: '0.5px' },

    // 3. Filter Bar (Floating)
    filterContainer: { display: 'flex', justifyContent: 'center', marginTop: '-35px', position: 'relative', zIndex: 20 },
    filterBar: { display: 'flex', gap: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    filterBtn: (isActive) => ({
        padding: '12px 28px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
        backgroundColor: isActive ? '#1e293b' : 'transparent', 
        color: isActive ? 'white' : '#64748b',
        transition: 'all 0.3s'
    }),

    // 4. Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px', maxWidth: '1280px', margin: '60px auto 0', padding: '0 25px' },

    // Card Design (Airbnb Style)
    card: (isAvailable) => ({
        backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', 
        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', transition: 'all 0.3s ease',
        border: '1px solid #f1f5f9', position: 'relative',
        opacity: isAvailable ? 1 : 0.8,
        filter: isAvailable ? 'none' : 'grayscale(10%)',
        cursor: isAvailable ? 'pointer' : 'default'
    }),
    
    imageBox: { position: 'relative', height: '240px', overflow: 'hidden' },
    img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' },
    
    // Status Badge
    badge: (status) => {
        let bg = '#22c55e'; // Available
        if(status !== 'Available') bg = '#ef4444'; // Occupied/Main
        return {
            position: 'absolute', top: '15px', right: '15px',
            backgroundColor: bg, color: 'white',
            padding: '6px 14px', borderRadius: '30px',
            fontSize: '11px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            textTransform: 'uppercase', letterSpacing: '0.5px'
        }
    },

    content: { padding: '25px' },
    
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' },
    roomName: { fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 },
    roomType: { fontSize: '12px', color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
    
    amenities: { display: 'flex', gap: '15px', marginBottom: '20px', color: '#64748b', fontSize: '13px', fontWeight: '500' },
    iconItem: { display: 'flex', alignItems: 'center', gap: '6px' },

    footerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
    price: { fontSize: '24px', fontWeight: '800', color: '#0f172a' },
    perNight: { fontSize: '14px', color: '#94a3b8', fontWeight: 'normal' },

    btn: (isAvailable) => ({
        padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: isAvailable ? 'pointer' : 'not-allowed',
        backgroundColor: isAvailable ? '#1e293b' : '#e2e8f0',
        color: isAvailable ? 'white' : '#94a3b8',
        fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
        transition: 'all 0.2s', fontSize: '14px'
    })
  };

  return (
    <div style={styles.container}>
      
      {/* 1. TOP NAVIGATION (Back Button) */}
      <div style={styles.nav}>
         <button 
            style={styles.backBtn} 
            onClick={() => navigate('/')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
         >
            <ArrowLeft size={18}/> Back Home
         </button>
         <div style={styles.brand}>LuxuryStay</div>
      </div>

      {/* 2. HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
            <h1 style={styles.title}>Our Exclusive Collection</h1>
            <p style={styles.sub}>Discover comfort and elegance in every corner.</p>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div style={styles.filterContainer}>
        <div style={styles.filterBar}>
            {['All', 'Standard', 'Deluxe', 'Suite', 'Luxury', 'Penthouse'].map(cat => (
                <button key={cat} style={styles.filterBtn(filter === cat)} onClick={() => setFilter(cat)}>
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* 4. LOADING & CONTENT */}
      {loading ? (
        <div style={{textAlign: 'center', padding: '80px'}}>
            <Loader className="animate-spin text-blue-600 mx-auto" size={40}/>
            <p style={{color:'#64748b', marginTop:'10px'}}>Curating best rooms for you...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div style={{textAlign:'center', color:'#94a3b8', marginTop:'50px'}}>
            <h3>No rooms found in this category.</h3>
        </div>
      ) : (
        
        // ROOMS GRID
        <div style={styles.grid}>
            {filteredRooms.map(room => {
                const isAvailable = room.currentStatus === 'Available';
                
                return (
                    <div 
                        key={room._id} 
                        style={styles.card(isAvailable)}
                        onMouseEnter={e => isAvailable && (e.currentTarget.style.transform = 'translateY(-8px)')}
                        onMouseLeave={e => isAvailable && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {/* Image */}
                        <div style={styles.imageBox}>
                            <div style={styles.badge(room.currentStatus)}>{room.currentStatus}</div>
                            <img src={getRoomImage(room)} alt={room.roomNumber} style={styles.img} />
                        </div>

                        {/* Content */}
                        <div style={styles.content}>
                            <div style={styles.headerRow}>
                                <div>
                                    <span style={styles.roomType}>{room.type}</span>
                                    <h3 style={styles.roomName}>Room {room.roomNumber}</h3>
                                </div>
                                <div style={{display:'flex', alignItems:'center', gap:'4px', color:'#f59e0b', fontWeight:'bold', fontSize:'13px'}}>
                                    <Star size={14} fill="currentColor"/> 4.8
                                </div>
                            </div>

                            <div style={styles.amenities}>
                                <span style={styles.iconItem}><Users size={16}/> {room.capacity} Guests</span>
                                <span style={styles.iconItem}><Wifi size={16}/> Free Wifi</span>
                                <span style={styles.iconItem}><Wind size={16}/> AC</span>
                            </div>

                            <div style={styles.footer}>
                                <div>
                                    <span style={styles.price}>${room.price}</span>
                                    <span style={styles.perNight}> /night</span>
                                </div>

                                <button 
                                    style={styles.btn(isAvailable)} 
                                    onClick={() => isAvailable && navigate(`/rooms/${room._id}`)}
                                    disabled={!isAvailable}
                                >
                                    {isAvailable ? "View Details" : "Booked"} 
                                    {isAvailable && <ArrowRight size={16}/>}
                                </button>
                            </div>
                        </div>
                    </div>
                );
                
            })}
        </div>
      )}
    </div>
    
  );
};

export default PublicRooms;