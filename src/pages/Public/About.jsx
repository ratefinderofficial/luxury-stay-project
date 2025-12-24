import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Users, Award, Globe, Heart } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  // --- PREMIUM STYLES ---
  const styles = {
    container: { fontFamily: "'Segoe UI', sans-serif", color: '#333', backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    
    // Navbar
    navbar: { padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 },
    backBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600', color: '#1e3a8a', transition: 'color 0.2s' },

    // Hero Section
    hero: { 
      textAlign: 'center', padding: '100px 20px', 
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', // Dot pattern
      backgroundSize: '20px 20px'
    },
    title: { fontSize: '48px', fontWeight: '800', color: '#1e3a8a', marginBottom: '20px', letterSpacing: '-1px' },
    sub: { color: '#64748b', fontSize: '20px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' },

    // Story Section
    section: { padding: '80px 10%', display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap' },
    imgBox: { flex: 1, minWidth: '350px' },
    img: { width: '100%', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    contentBox: { flex: 1, minWidth: '350px' },
    heading: { fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' },
    text: { lineHeight: '1.8', color: '#4b5563', marginBottom: '30px', fontSize: '16px' },

    // Stats Grid
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '30px', marginTop: '30px' },
    statCard: { textAlign: 'center', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '16px' },
    statNumber: { fontSize: '36px', fontWeight: 'bold', color: '#d97706' },
    statLabel: { fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' },

    // Core Values
    valuesSection: { backgroundColor: '#1e3a8a', color: 'white', padding: '80px 10%', textAlign: 'center' },
    valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginTop: '50px' },
    valueCard: { padding: '30px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(10px)' },
    iconBox: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' },

    // Footer
    footer: { backgroundColor: '#0f172a', color: 'white', padding: '60px 5%', marginTop: 'auto' },
    footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }
  };

  return (
    <div style={styles.container}>
      
      {/* Navigation */}
      <div style={styles.navbar}>
        <button 
            style={styles.backBtn} 
            onClick={() => navigate('/')}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = '#1e3a8a'}
        >
            <ArrowLeft size={20}/> Back to Home
        </button>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Redefining Luxury Since 1998</h1>
        <p style={styles.sub}>
            We don't just offer rooms; we create memories. 
            Experience the perfect blend of modern elegance and timeless hospitality.
        </p>
      </div>

      {/* Our Story */}
      <div style={styles.section}>
        <div style={styles.imgBox}>
            <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070" style={styles.img} alt="Hotel Interior"/>
        </div>
        <div style={styles.contentBox}>
            <h2 style={styles.heading}>Our Mission</h2>
            <p style={styles.text}>
                At <strong>LuxuryStay Hospitality</strong>, our goal is to revolutionize the way you travel. 
                Located in the heart of the city, we have hosted dignitaries, celebrities, and travelers 
                from around the globe. Our commitment to excellence is what sets us apart.
            </p>
            
            <div style={{display:'flex', gap:'15px', flexDirection:'column'}}>
                <div style={{display:'flex', gap:'12px', alignItems:'center', color:'#4b5563'}}>
                    <CheckCircle color="#2563eb" size={20}/> <span>World-class sustainable architecture</span>
                </div>
                <div style={{display:'flex', gap:'12px', alignItems:'center', color:'#4b5563'}}>
                    <CheckCircle color="#2563eb" size={20}/> <span>24/7 Concierge and Room Service</span>
                </div>
                <div style={{display:'flex', gap:'12px', alignItems:'center', color:'#4b5563'}}>
                    <CheckCircle color="#2563eb" size={20}/> <span>Award-winning Spa & Wellness Center</span>
                </div>
            </div>

            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>25+</div>
                    <div style={styles.statLabel}>Years of Excellence</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>50k+</div>
                    <div style={styles.statLabel}>Happy Guests</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>15</div>
                    <div style={styles.statLabel}>International Awards</div>
                </div>
            </div>
        </div>
      </div>

      {/* Core Values */}
      <div style={styles.valuesSection}>
        <h2 style={{fontSize:'36px', fontWeight:'bold'}}>Why Choose Us?</h2>
        <p style={{opacity:0.8, fontSize:'18px', marginTop:'10px'}}>The pillars of our hospitality.</p>
        
        <div style={styles.valuesGrid}>
            <div style={styles.valueCard}>
                <div style={styles.iconBox}><Heart size={28}/></div>
                <h3 style={{fontSize:'20px', fontWeight:'bold', marginBottom:'10px'}}>Customer First</h3>
                <p style={{opacity:0.8, fontSize:'14px'}}>Your comfort is our top priority. We go the extra mile to make you smile.</p>
            </div>
            <div style={styles.valueCard}>
                <div style={styles.iconBox}><Award size={28}/></div>
                <h3 style={{fontSize:'20px', fontWeight:'bold', marginBottom:'10px'}}>Premium Quality</h3>
                <p style={{opacity:0.8, fontSize:'14px'}}>From bed linens to dining, everything is sourced from the best.</p>
            </div>
            <div style={styles.valueCard}>
                <div style={styles.iconBox}><Globe size={28}/></div>
                <h3 style={{fontSize:'20px', fontWeight:'bold', marginBottom:'10px'}}>Eco Friendly</h3>
                <p style={{opacity:0.8, fontSize:'14px'}}>We are committed to sustainability and reducing our carbon footprint.</p>
            </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div style={styles.footer}>
        <div style={styles.footerGrid}>
            <div>
                <h2 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'20px'}}>LuxuryStay</h2>
                <p style={{opacity:0.7, lineHeight:'1.6'}}>
                    123 Luxury Ave, Beverly Hills<br/>
                    California, 90210<br/>
                    +1 (234) 567-8900
                </p>
            </div>
            <div>
                <h3 style={{fontWeight:'bold', marginBottom:'15px'}}>Quick Links</h3>
                <p style={{opacity:0.7, cursor:'pointer', marginBottom:'10px'}} onClick={() => navigate('/rooms')}>Rooms & Suites</p>
                <p style={{opacity:0.7, cursor:'pointer', marginBottom:'10px'}} onClick={() => navigate('/about')}>About Us</p>
                <p style={{opacity:0.7, cursor:'pointer', marginBottom:'10px'}} onClick={() => navigate('/contact')}>Contact</p>
            </div>
            <div>
                <h3 style={{fontWeight:'bold', marginBottom:'15px'}}>Connect</h3>
                <p style={{opacity:0.7, marginBottom:'10px'}}>Facebook</p>
                <p style={{opacity:0.7, marginBottom:'10px'}}>Instagram</p>
                <p style={{opacity:0.7, marginBottom:'10px'}}>Twitter</p>
            </div>
        </div>
        <p style={{textAlign:'center', marginTop:'50px', opacity:0.4, fontSize:'13px', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'20px'}}>
            © 2025 LuxuryStay Hospitality. All rights reserved.
        </p>
      </div>

    </div>
  );
};

export default About;