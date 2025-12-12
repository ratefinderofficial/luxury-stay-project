import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Users, ArrowRight, Star, BedDouble, Wifi, Info } from 'lucide-react';

const AllRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // --- 🔥 DUMMY DATA (Agar Database Khali ho to ye dikhega) ---
  const DUMMY_ROOMS = [
    {
        _id: 'dummy1',
        roomNumber: '101',
        type: 'Deluxe Ocean View',
        price: 250,
        capacity: 2,
        description: 'Enjoy a breathtaking view of the ocean with our premium amenities.',
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop'],
        isDummy: true
    },
    {
        _id: 'dummy2',
        roomNumber: '102',
        type: 'Standard King',
        price: 150,
        capacity: 2,
        description: 'Comfortable king-sized bed perfect for couples.',
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop'],
        isDummy: true
    },
    {
        _id: 'dummy3',
        roomNumber: '205',
        type: 'Family Suite',
        price: 400,
        capacity: 4,
        description: 'Spacious suite designed for family vacations.',
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop'],
        isDummy: true
    },
    {
        _id: 'dummy4',
        roomNumber: '301',
        type: 'Presidential Suite',
        price: 1200,
        capacity: 2,
        description: 'Ultimate luxury with private pool and butler service.',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop'],
        isDummy: true
    }
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/rooms');
        
        if (Array.isArray(res.data) && res.data.length > 0) {
            setRooms(res.data); // Asli Data
        } else {
            setRooms(DUMMY_ROOMS); // 👈 Agar DB khali hai to Dummy dikhao
        }
      } catch (error) {
        console.error("API Error, showing dummy data");
        setRooms(DUMMY_ROOMS); // Error par bhi Dummy dikhao
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Filter Logic
  const filtered = rooms.filter(r => 
    r.roomNumber.toLowerCase().includes(search.toLowerCase()) || 
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  if(loading) return <div style={{padding: 50, textAlign:'center'}}>Loading Rooms...</div>;

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>Our Luxury Rooms</h1>
            <p style={{ color: '#64748b' }}>Select your perfect stay.</p>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '10px 20px', borderRadius: '50px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <Search size={20} color="#94a3b8"/>
                <input 
                    placeholder="Search by Room Type or Number..." 
                    style={{ border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '15px' }} 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                />
            </div>
        </div>

        {/* Rooms Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {filtered.map(room => (
                <div 
                    key={room._id} 
                    style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', transition: 'transform 0.2s', position: 'relative' }} 
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-5px)'} 
                    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
                >
                    {/* Dummy Badge (Optional: Sirf tab dikhega jab dummy data ho) */}
                    {room.isDummy && (
                        <div style={{position: 'absolute', top: 10, right: 10, backgroundColor: '#f59e0b', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', zIndex: 10}}>
                            DEMO
                        </div>
                    )}

                    {/* Image */}
                    <div style={{ height: '200px', backgroundColor: '#e2e8f0' }}>
                        <img 
                            src={room.images?.[0] || 'https://via.placeholder.com/500x300?text=Luxury+Room'} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            alt="Room" 
                        />
                    </div>

                    {/* Content */}
                    <div style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{room.type}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: 'bold', color: '#f59e0b' }}>
                                <Star size={16} fill="currentColor"/> 4.8
                            </div>
                        </div>
                        
                        {/* Features */}
                        <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={16}/> {room.capacity} Guests</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><BedDouble size={16}/> King Bed</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Wifi size={16}/> Wifi</span>
                        </div>

                        {/* Price & Action */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                            <div>
                                <span style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>${room.price}</span>
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}> / night</span>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    if(room.isDummy) {
                                        alert("Yeh Demo Room hai. Asli booking ke liye Admin Panel se room add karein.");
                                    } else {
                                        navigate(`/book/${room._id}`);
                                    }
                                }} 
                                style={{ backgroundColor: '#1e293b', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                Book Now <ArrowRight size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default AllRooms;