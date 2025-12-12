import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Send, Clock, Globe, Facebook, Instagram, Twitter } from 'lucide-react';

const Contact = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        alert("✅ Message Sent Successfully! We will get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
        setLoading(false);
    }, 1500);
  };

  // --- PREMIUM STYLES ---
  const styles = {
    container: { fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    
    // Navbar
    navbar: { padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 },
    backBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600', color: '#1e3a8a', transition: 'color 0.2s' },

    // Main Layout
    wrapper: { maxWidth: '1100px', margin: '60px auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', gap: '0', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '20px', overflow: 'hidden', backgroundColor: 'white' },

    // Left Side (Info)
    infoCard: { flex: '1', minWidth: '350px', backgroundColor: '#1e3a8a', color: 'white', padding: '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    infoTitle: { fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' },
    infoSub: { opacity: 0.8, marginBottom: '40px', lineHeight: '1.6' },
    
    infoItem: { display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-start' },
    iconCircle: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    itemLabel: { fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' },
    itemValue: { fontSize: '16px', fontWeight: '600' },

    // Right Side (Form)
    formCard: { flex: '1.5', minWidth: '400px', backgroundColor: 'white', padding: '60px 50px' },
    formTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' },
    
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#4b5563' },
    input: { width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none', backgroundColor: '#f9fafb', transition: 'border 0.2s', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none', backgroundColor: '#f9fafb', minHeight: '150px', resize: 'vertical', boxSizing: 'border-box' },
    
    btn: { width: '100%', padding: '16px', backgroundColor: '#d97706', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'transform 0.1s', marginTop: '10px' },

    socials: { display: 'flex', gap: '15px', marginTop: '40px' },
    socialDot: { width: '35px', height: '35px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },

    // Map Section
    mapSection: { width: '100%', height: '450px', marginTop: '60px', filter: 'grayscale(20%)' }, // Thoda grey filter premium look ke liye
    
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

      <div style={styles.wrapper}>
        
        {/* Left Column: Contact Info */}
        <div style={styles.infoCard}>
            <div>
                <h2 style={styles.infoTitle}>Get in Touch</h2>
                <p style={styles.infoSub}>
                    Have an inquiry or want to book a special event? 
                    Our concierge team is available 24/7 to assist you.
                </p>

                <div style={styles.infoItem}>
                    <div style={styles.iconCircle}><Phone size={20}/></div>
                    <div>
                        <div style={styles.itemLabel}>Phone</div>
                        <div style={styles.itemValue}>+1 (234) 567-8900</div>
                    </div>
                </div>

                <div style={styles.infoItem}>
                    <div style={styles.iconCircle}><Mail size={20}/></div>
                    <div>
                        <div style={styles.itemLabel}>Email</div>
                        <div style={styles.itemValue}>reservations@luxurystay.com</div>
                    </div>
                </div>

                <div style={styles.infoItem}>
                    <div style={styles.iconCircle}><MapPin size={20}/></div>
                    <div>
                        <div style={styles.itemLabel}>Location</div>
                        <div style={styles.itemValue}>123 Luxury Ave, Beverly Hills, CA</div>
                    </div>
                </div>

                <div style={styles.infoItem}>
                    <div style={styles.iconCircle}><Clock size={20}/></div>
                    <div>
                        <div style={styles.itemLabel}>Hours</div>
                        <div style={styles.itemValue}>Open 24/7</div>
                    </div>
                </div>
            </div>

            {/* Social Icons */}
            <div style={styles.socials}>
                <div style={styles.socialDot}><Globe size={16}/></div>
                <div style={styles.socialDot}><Instagram size={16}/></div>
                <div style={styles.socialDot}><Twitter size={16}/></div>
                <div style={styles.socialDot}><Facebook size={16}/></div>
            </div>
        </div>

        {/* Right Column: Form */}
        <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Send us a Message</h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Your Name</label>
                        <input 
                            style={styles.input} 
                            type="text" 
                            placeholder="John Doe" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            style={styles.input} 
                            type="email" 
                            placeholder="john@example.com" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Subject</label>
                    <input 
                        style={styles.input} 
                        type="text" 
                        placeholder="Booking Inquiry / Feedback" 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Message</label>
                    <textarea 
                        style={styles.textarea} 
                        placeholder="How can we help you today?" 
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        required
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    style={styles.btn} 
                    disabled={loading}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    {loading ? "Sending..." : <><Send size={18}/> Send Message</>}
                </button>
            </form>
        </div>
      </div>

      {/* --- GOOGLE MAP EMBED --- */}
      <div style={styles.mapSection}>
        <iframe 
            title="Hotel Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.733248043701!2d-118.4003563238129!3d34.0758276731476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1709667508492!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
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

export default Contact;