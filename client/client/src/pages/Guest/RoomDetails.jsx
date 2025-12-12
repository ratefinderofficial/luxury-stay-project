import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wifi, Tv, Wind, Coffee, ArrowLeft, CheckCircle, Users, BedDouble, Maximize } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/rooms/${id}`);
        setRoom(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  // Premium CSS
  const styles = {
    container: { padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    wrapper: { maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' },
    
    // Image Section
    imageGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '5px', height: '400px' },
    mainImg: { width: '100%', height: '100%', objectFit: 'cover' },
    sideImgCol: { display: 'flex', flexDirection: 'column', gap: '5px' },
    sideImg: { width: '100%', height: '50%', objectFit: 'cover' },

    // Content
    content: { padding: '40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' },
    
    // Left Content
    title: { fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '10px' },
    tagLine: { fontSize: '16px', color: '#64748b', marginBottom: '30px' },
    
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#334155', marginBottom: '15px', marginTop: '30px' },
    
    amenitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' },
    amenity: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '10px', fontSize: '14px', color: '#475569' },

    desc: { lineHeight: '1.8', color: '#4b5563', fontSize: '15px' },

    // Right Sidebar (Booking Card)
    bookCard: { padding: '30px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' },
    priceRow: { display: 'flex', alignItems: 'end', gap: '5px', marginBottom: '20px' },
    price: { fontSize: '32px', fontWeight: '800', color: '#2563eb' },
    
    bookBtn: { width: '100%', padding: '15px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px' },
    
    backBtn: { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }
  };

  if(loading) return <p style={{textAlign:'center', marginTop: 50}}>Loading Details...</p>;
  if(!room) return <p>Room not found.</p>;

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}><ArrowLeft size={18}/> Back to Rooms</button>
      
      <div style={styles.wrapper}>
        {/* Images (Main + Side) */}
        <div style={styles.imageGrid}>
            <img src={room.images?.[0] || 'https://via.placeholder.com/800'} style={styles.mainImg} alt="Main" />
            <div style={styles.sideImgCol}>
                <img src={room.images?.[1] || 'https://via.placeholder.com/400'} style={styles.sideImg} alt="Side 1" />
                <img src={room.images?.[2] || 'https://via.placeholder.com/400'} style={styles.sideImg} alt="Side 2" />
            </div>
        </div>

        <div style={styles.content}>
            {/* Left Side: Details */}
            <div>
                <h1 style={styles.title}>Room {room.roomNumber} - {room.type}</h1>
                <p style={styles.tagLine}>Experience luxury with our premium services.</p>

                <div style={{display:'flex', gap:'20px', marginBottom:'30px'}}>
                    <span style={{display:'flex', alignItems:'center', gap:5}}><Users size={18}/> {room.capacity} Guests</span>
                    <span style={{display:'flex', alignItems:'center', gap:5}}><BedDouble size={18}/> King Bed</span>
                    <span style={{display:'flex', alignItems:'center', gap:5}}><Maximize size={18}/> 450 sq.ft</span>
                </div>

                <div style={styles.desc}>{room.description || "This room features a balcony with ocean views, a minibar, and a flat-screen TV. Perfect for couples or solo travelers looking for a luxury experience."}</div>

                <h3 style={styles.sectionTitle}>Amenities & Features</h3>
                <div style={styles.amenitiesGrid}>
                    <div style={styles.amenity}><Wifi size={18}/> Free Wifi</div>
                    <div style={styles.amenity}><Tv size={18}/> Smart TV</div>
                    <div style={styles.amenity}><Wind size={18}/> AC</div>
                    <div style={styles.amenity}><Coffee size={18}/> Coffee Maker</div>
                </div>
            </div>

            {/* Right Side: Booking Card */}
            <div style={styles.bookCard}>
                <div style={styles.priceRow}>
                    <span style={styles.price}>${room.price}</span>
                    <span style={{color:'#64748b'}}>/ night</span>
                </div>
                
                <div style={{marginBottom: 20}}>
                    <p style={{fontSize:'14px', fontWeight:'bold', marginBottom:10}}>What's included?</p>
                    <p style={{display:'flex', alignItems:'center', gap:5, fontSize:'13px', color:'#475569', marginBottom:5}}><CheckCircle size={14} color="green"/> Breakfast Included</p>
                    <p style={{display:'flex', alignItems:'center', gap:5, fontSize:'13px', color:'#475569'}}><CheckCircle size={14} color="green"/> Free Cancellation</p>
                </div>

                <button style={styles.bookBtn} onClick={() => navigate(`/book/${room._id}`)}>
                    Book Now
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;