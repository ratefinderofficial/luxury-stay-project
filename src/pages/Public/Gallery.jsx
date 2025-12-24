import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, MapPin, Star, ArrowLeft, X, ZoomIn, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

// --- 📸 12 REAL LUXURY IMAGES (Working Links) ---
const galleryPhotos = [
    { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070", title: "Grand Exterior" },
    { src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070", title: "Royal Lobby" },
    { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070", title: "Presidential Suite" },
    { src: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070", title: "Infinity Pool" },
    { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070", title: "Fine Dining" },
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070", title: "Private Villa" },
    { src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070", title: "Ocean View Room" },
    { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070", title: "Luxury Spa" },
    { src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070", title: "Sky Bar" },
    { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070", title: "Resort View" },
    { src: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2070", title: "Modern Bedroom" },
    { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2070", title: "Gourmet Breakfast" }
];

const Gallery = () => {
    const navigate = useNavigate();
    const [selectedImg, setSelectedImg] = useState(null); // Modal ke liye

    // --- STYLES ---
    const styles = {
        container: { 
            paddingTop: '40px', 
            minHeight: '100vh', 
            backgroundColor: '#f8fafc',
            fontFamily: "'Segoe UI', sans-serif"
        },
        header: {
            textAlign: 'center',
            marginBottom: '50px',
            padding: '0 20px'
        },
        title: {
            fontSize: '42px',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '10px'
        },
        subtitle: {
            color: '#64748b',
            fontSize: '16px',
            maxWidth: '600px',
            margin: '0 auto'
        },
        backBtn: {
            position: 'absolute', top: '30px', left: '30px',
            background: 'white', border: '1px solid #e2e8f0',
            padding: '10px 15px', borderRadius: '30px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: 'bold', color: '#475569',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        },
        
        // Grid
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
            padding: '0 5%',
            paddingBottom: '80px'
        },
        card: {
            position: 'relative',
            height: '300px',
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            group: 'hover'
        },
        img: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
        },
        overlay: {
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s',
            display: 'flex', alignItems: 'flex-end', padding: '20px'
        },
        imgTitle: {
            color: 'white', fontWeight: 'bold', fontSize: '18px'
        },

        // Modal (Full Screen)
        modal: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px'
        },
        modalImg: {
            maxWidth: '90%', maxHeight: '90vh', borderRadius: '8px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        },
        closeBtn: {
            position: 'absolute', top: '30px', right: '30px',
            background: 'white', borderRadius: '50%', padding: '10px',
            cursor: 'pointer', border: 'none'
        },

        // Footer
        footer: { backgroundColor: '#0f172a', color: 'white', padding: '60px 5%', marginTop: 'auto' },
        footerContent: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' },
        fTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: 'white' },
        fLink: { display: 'block', color: '#94a3b8', marginBottom: '12px', textDecoration: 'none', fontSize: '14px', cursor:'pointer' },
        fText: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }
    };

    return (
        <div style={styles.container}>
            
            {/* Back Button */}
            <button style={styles.backBtn} onClick={() => navigate('/')}>
                <ArrowLeft size={18}/> Back Home
            </button>

            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>
                    <span style={{color:'#2563eb'}}>Visual</span> Journey
                </h1>
                <p style={styles.subtitle}>
                    Explore the elegance, comfort, and luxury that awaits you at LuxuryStay. 
                    Every corner is designed for your ultimate relaxation.
                </p>
            </div>

            {/* Image Grid */}
            <div style={styles.grid}>
                {galleryPhotos.map((photo, index) => (
                    <div 
                        key={index} 
                        style={styles.card}
                        onClick={() => setSelectedImg(photo.src)}
                        onMouseEnter={(e) => {
                            e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
                            e.currentTarget.querySelector('.overlay').style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                            e.currentTarget.querySelector('.overlay').style.opacity = '0';
                        }}
                    >
                        <img src={photo.src} alt={photo.title} style={styles.img} />
                        <div className="overlay" style={styles.overlay}>
                            <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span style={styles.imgTitle}>{photo.title}</span>
                                <ZoomIn color="white" size={20}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImg && (
                <div style={styles.modal} onClick={() => setSelectedImg(null)}>
                    <button style={styles.closeBtn} onClick={() => setSelectedImg(null)}>
                        <X size={24} color="black"/>
                    </button>
                    <img src={selectedImg} style={styles.modalImg} alt="Full View" />
                </div>
            )}

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div>
                        <div style={{fontSize:'24px', fontWeight:'bold', marginBottom:'20px'}}>LuxuryStay</div>
                        <p style={styles.fText}>Experience the pinnacle of luxury and hospitality. Your comfort is our priority.</p>
                    </div>
                    <div>
                        <div style={styles.fTitle}>Explore</div>
                        <p style={styles.fLink} onClick={() => navigate('/')}>Home</p>
                        <p style={styles.fLink} onClick={() => navigate('/rooms')}>Rooms & Suites</p>
                        <p style={styles.fLink} onClick={() => navigate('/about')}>About Us</p>
                    </div>
                    <div>
                        <div style={styles.fTitle}>Contact</div>
                        <p style={styles.fLink}><Phone size={16} style={{display:'inline', marginRight:5}}/> +1 234 567 890</p>
                        <p style={styles.fLink}><Mail size={16} style={{display:'inline', marginRight:5}}/> info@luxurystay.com</p>
                        <p style={styles.fLink}><MapPin size={16} style={{display:'inline', marginRight:5}}/> Beverly Hills, CA</p>
                    </div>
                    <div>
                        <div style={styles.fTitle}>Follow Us</div>
                        <div style={{display:'flex', gap:'15px', color:'white'}}>
                            <Instagram style={{cursor:'pointer'}}/>
                            <Facebook style={{cursor:'pointer'}}/>
                            <Twitter style={{cursor:'pointer'}}/>
                        </div>
                    </div>
                </div>
                <div style={{textAlign:'center', marginTop:'50px', borderTop:'1px solid #1e293b', paddingTop:'20px', color:'#64748b', fontSize:'13px'}}>
                    © 2025 LuxuryStay Hospitality. All rights reserved.
                </div>
            </footer>

        </div>
    );
};

export default Gallery;