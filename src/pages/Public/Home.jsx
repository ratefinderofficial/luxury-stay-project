import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowRight, Star, Menu, X, LogIn, LayoutDashboard, User, 
    CalendarCheck, Quote, Utensils, Wifi, MapPin, Search, Hotel 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth'; // Ensure this path is correct

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // --- Booking Widget State ---
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);

    // --- LOGIC: Dashboard Redirect ---
    const handleDashboardClick = () => {
        if (user?.role === 'admin' || user?.role === 'manager') {
            navigate('/dashboard');
        } else {
            navigate('/guest/dashboard');
        }
    };

    // --- LOGIC: Handle Booking Search ---
    const handleSearch = () => {
        // Navigate to rooms page with query parameters
        navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    };

    // --- DUMMY DATA ---
    const featuredRooms = [
        { id: 1, name: "Deluxe Ocean Suite", price: 350, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070", features: ["King Bed", "Ocean View", "Jacuzzi"], rating: 5.0 },
        { id: 2, name: "Executive City Room", price: 200, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074", features: ["Queen Bed", "Work Desk", "Free Breakfast"], rating: 4.8 },
        { id: 3, name: "Family Garden Villa", price: 500, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070", features: ["2 Bedrooms", "Private Pool", "Kitchen"], rating: 4.9 }
    ];

    const testimonials = [
        { id: 1, quote: "The Ocean Suite was pure bliss. Unmatched service and breathtaking views. Definitely coming back!", author: "Aisha K.", city: "Dubai" },
        { id: 2, quote: "Perfect blend of luxury and convenience. The staff went above and beyond to make my business trip comfortable.", author: "Faisal M.", city: "New York" },
    ];

    const galleryImages = [
        
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1921&auto=format&fit=crop", // Restaurant
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",// Spa
    ];


    return (
        <>
            {/* --- INTERNAL CSS (Recommended to move to a global stylesheet later) --- */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                    
                    body {
                        font-family: 'Inter', sans-serif;
                        color: #1e293b; /* Slate-800 */
                        overflow-x: hidden;
                        margin: 0;
                        padding: 0;
                    }

                    .main-container {
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                    }

                    /* --- NAVBAR --- */
                    .navbar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 15px 5%;
                        position: fixed;
                        width: 100%;
                        top: 0;
                        background-color: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(10px);
                        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                        z-index: 1000;
                        box-sizing: border-box;
                    }
                    .logo {
                        font-size: 26px;
                        font-weight: 800;
                        color: #1e3a8a;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                        transition: color 0.2s;
                    }
                    .logo-icon {
                        width: 40px;
                        height: 40px;
                        background-color: #2563eb; 
                        color: white;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .nav-link {
                        text-decoration: none;
                        color: #4b5563; 
                        font-weight: 600;
                        font-size: 15px;
                        cursor: pointer;
                        padding: 5px 0;
                        transition: color 0.2s;
                    }
                    .nav-link:hover, .nav-link.active {
                        color: #2563eb; 
                    }
                    .auth-btn {
                        background-color: #2563eb;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 30px;
                        border: none;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
                        transition: all 0.2s;
                    }
                    .dashboard-btn {
                        background-color: #1e293b; 
                        color: white;
                        padding: 10px 20px;
                        border-radius: 30px;
                        border: none;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: background-color 0.2s;
                    }
                    .dashboard-btn:hover {
                        background-color: #334155;
                    }

                    /* --- MOBILE MENU --- */
                    .mobile-menu-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: white;
                        z-index: 999;
                        padding: 20px 5%;
                        display: flex;
                        flex-direction: column;
                        transition: transform 0.3s ease-in-out;
                        transform: translateX(100%);
                    }
                    .mobile-menu-overlay.open {
                        transform: translateX(0);
                    }
                    .mobile-menu-item { 
                        font-size: 18px; 
                        font-weight: 600; 
                        color: #1e3a8a; 
                        padding: 15px 0; 
                        border-bottom: 1px solid #f1f5f9; 
                        cursor: pointer;
                    }
                    @media (min-width: 769px) {
                        .mobile-menu-btn { display: none; }
                    }
                    @media (max-width: 768px) {
                        .desktop-nav-links { display: none; }
                    }

                    /* --- HERO --- */
                    .hero-section {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        flex-direction: column;
                        color: white;
                        background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070");
                        background-size: cover;
                        background-position: center;
                        background-attachment: fixed;
                        padding: 20px;
                        padding-top: 80px;
                    }
                    .hero-title {
                        font-size: clamp(40px, 5vw, 70px);
                        font-weight: 800;
                        margin-bottom: 20px;
                        line-height: 1.1;
                        text-shadow: 0 4px 15px rgba(0,0,0,0.4);
                        max-width: 900px;
                    }
                    .hero-sub {
                        font-size: clamp(16px, 2vw, 22px);
                        max-width: 700px;
                        margin-bottom: 40px;
                        opacity: 0.9;
                    }
                    .hero-btn {
                        padding: 18px 45px;
                        font-size: 18px;
                        background-color: #d97706; /* Amber-600 */
                        color: white;
                        border: none;
                        border-radius: 50px;
                        cursor: pointer;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        box-shadow: 0 10px 30px rgba(217, 119, 6, 0.4);
                        transition: transform 0.2s, background-color 0.2s;
                        text-decoration: none;
                    }
                    .hero-btn:hover {
                        transform: scale(1.05);
                        background-color: #b45309; 
                    }
                    @media (max-width: 576px) {
                        .hero-btn { width: 100%; justify-content: center; }
                    }

                    /* --- SECTIONS --- */
                    .section-padding { padding: 80px 5%; }
                    .bg-light { background-color: #f8fafc; }
                    .bg-white { background-color: white; }
                    .section-header { text-align: center; margin-bottom: 50px; }
                    .section-title { font-size: 36px; font-weight: 800; color: #1e293b; margin-bottom: 10px; }
                    .section-sub { color: #64748b; font-size: 16px; }

                    /* --- GRID LAYOUT --- */
                    .grid-3 {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 30px;
                    }
                    @media (max-width: 992px) {
                        .grid-3 { grid-template-columns: repeat(2, 1fr); }
                    }
                    @media (max-width: 768px) {
                        .grid-3 { grid-template-columns: 1fr; }
                    }
                    .grid-4 {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 15px;
                    }
                    @media (max-width: 768px) {
                        .grid-4 { grid-template-columns: repeat(2, 1fr); }
                    }

                    /* --- BOOKING WIDGET --- */
                    .booking-widget-container {
                        padding: 0 5%; 
                        margin-top: -50px; 
                        position: relative; 
                        z-index: 50;
                    }
                    .booking-widget {
                        background-color: white;
                        border-radius: 15px;
                        padding: 25px;
                        box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .form-group {
                        flex: 1; 
                        min-width: 150px;
                    }
                    .form-label { 
                        display: block; 
                        font-size: 12px; 
                        font-weight: bold; 
                        color: #64748b; 
                        margin-bottom: 5px; 
                    }
                    .form-input, .form-select {
                        width: 100%; 
                        padding: 10px; 
                        border: 1px solid #e2e8f0; 
                        border-radius: 8px; 
                        font-size: 16px; 
                        color: #1e293b;
                        box-sizing: border-box;
                    }
                    .booking-btn {
                        background-color: #d97706;
                        color: white;
                        padding: 12px 25px;
                        border-radius: 8px;
                        border: none;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: background-color 0.2s;
                        height: 48px;
                        margin-top: 15px;
                    }
                    @media (max-width: 600px) {
                        .booking-btn { width: 100%; justify-content: center; }
                        .form-group { min-width: 100%; }
                    }


                    /* --- ROOM CARD --- */
                    .room-card { 
                        background-color: white; 
                        border-radius: 20px; 
                        overflow: hidden; 
                        box-shadow: 0 15px 40px rgba(0,0,0,0.08); 
                        transition: transform 0.3s, box-shadow 0.3s; 
                        cursor: pointer;
                        border: 1px solid #f1f5f9;
                    }
                    .room-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    }
                    .room-img {
                        width: 100%;
                        height: 250px;
                        object-fit: cover;
                    }
                    .room-content { padding: 25px; }
                    .room-title { font-size: 22px; font-weight: bold; color: #1e293b; margin-bottom: 10px; }
                    .room-price { font-size: 26px; font-weight: 800; color: #2563eb; }
                    .per-night { font-size: 14px; color: #64748b; font-weight: normal; }
                    .feature-tag { 
                        font-size: 12px; 
                        background-color: #e2e8f0; 
                        padding: 5px 10px; 
                        border-radius: 8px; 
                        color: #475569; 
                        font-weight: 600;
                    }
                    .book-card-btn {
                        background-color: #d97706; 
                        color: white;
                        width: 100%;
                        padding: 12px;
                        margin-top: 20px;
                        border: none;
                        border-radius: 10px;
                        font-weight: bold;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 8px;
                        transition: background-color 0.2s;
                    }
                    .book-card-btn:hover { background-color: #b45309; }

                    /* --- CTA STRIP --- */
                    .cta-strip { 
                        background-color: #1e293b; 
                        color: white;
                        padding: 50px;
                        margin: 50px 5%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 15px;
                    }
                    .cta-strip-title { font-size: 30px; font-weight: 700; }
                    .cta-strip-btn {
                        padding: 15px 30px; 
                        font-size: 16px; 
                        background-color: #d97706; 
                        color: white;
                        border: none; 
                        border-radius: 40px; 
                        cursor: pointer; 
                        font-weight: bold;
                        display: flex; 
                        align-items: center; 
                        gap: 8px;
                        transition: background-color 0.2s;
                    }
                    .cta-strip-btn:hover { background-color: #b45309; }
                    @media (max-width: 768px) {
                        .cta-strip { 
                            flex-direction: column; 
                            text-align: center; 
                            padding: 30px;
                        }
                        .cta-strip-title { font-size: 24px; }
                    }

                    /* --- AMENITIES/FEATURES --- */
                    .feature-box { 
                        text-align: center; 
                        padding: 40px 20px; 
                        border-radius: 20px; 
                        background-color: white; 
                        border: 1px solid #e2e8f0; 
                        box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                        transition: transform 0.2s, box-shadow 0.2s;
                    }
                    .feature-box:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    }
                    .icon-circle { 
                        width: 70px; 
                        height: 70px; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        margin: 0 auto 20px auto;
                    }

                    /* Specific Feature Colors */
                    .star-icon { background-color: #dbeafe; color: #2563eb; }
                    .utensils-icon { background-color: #fef3c7; color: #d97706; }
                    .wifi-icon { background-color: #dcfce7; color: #16a34a; }
                    .promise-icon { background-color: #e5e7eb; color: #4b5563; }

                    /* --- GALLERY PREVIEW --- */
                    .gallery-img {
                        width: 100%;
                        height: 250px;
                        object-fit: cover;
                        border-radius: 15px;
                        transition: transform 0.3s, opacity 0.3s;
                        cursor: pointer;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    }
                    .gallery-img:hover {
                        transform: scale(1.03);
                        opacity: 0.9;
                    }

                    /* --- TESTIMONIALS --- */
                    .testimonial-card {
                        background-color: #f8fafc;
                        padding: 30px;
                        border-radius: 15px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                        border-left: 5px solid #2563eb;
                        height: 100%;
                    }
                    .quote-text { font-size: 16px; line-height: 1.7; color: #475569; font-style: italic; }
                    .author-info { display: flex; align-items: center; margin-top: 20px; gap: 15px; }
                    .avatar { 
                        width: 50px; 
                        height: 50px; 
                        border-radius: 50%; 
                        background-color: #2563eb; 
                        color: white; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-weight: bold; 
                        font-size: 18px;
                    }

                    /* --- FOOTER --- */
                    .footer { 
                        background-color: #0f172a; 
                        color: white; 
                        padding: 60px 5%; 
                        margin-top: auto; 
                    }
                    .footer-grid { 
                        display: grid; 
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                        gap: 40px; 
                    }
                    .footer-text { opacity: 0.7; line-height: 1.6; }
                    .footer-link-title { font-weight: bold; margin-bottom: 15px; font-size: 18px; }
                    .footer-link { opacity: 0.7; cursor: pointer; margin-bottom: 10px; transition: opacity 0.2s; }
                    .footer-link:hover { opacity: 1; }
                `}
            </style>

            <div className="main-container">
                
                {/* --- 1. NAVBAR --- */}
                <nav className="navbar">
                    <div className="logo" onClick={() => navigate('/')}>
                        <div className="logo-icon"><Star size={22} fill="white" /></div>
                        LuxuryStay
                    </div>

                    {/* Desktop Menu */}
                    <div className="desktop-nav-links" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <span className="nav-link active" onClick={() => navigate('/')}>Home</span>
                        <span className="nav-link" onClick={() => navigate('/rooms')}>Rooms & Suites</span>
                        <span className="nav-link" onClick={() => navigate('/gallery')}>Gallery</span>
                        <span className="nav-link" onClick={() => navigate('/about')}>About Us</span>
                        <span className="nav-link" onClick={() => navigate('/contact')}>Contact</span>
                    </div>

                    {/* Auth Buttons & Mobile Menu Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {user ? (
                            <button 
                                className="dashboard-btn" 
                                onClick={handleDashboardClick}
                                title={`Logged in as ${user.name}`}
                            >
                                {window.innerWidth > 768 ? <LayoutDashboard size={18}/> : <User size={18}/>}
                                {window.innerWidth > 768 ? (user.role === 'admin' ? 'Admin Panel' : 'My Dashboard') : ''}
                            </button>
                        ) : (
                            <button className="auth-btn" onClick={() => navigate('/login')}>
                                <LogIn size={18}/> {window.innerWidth > 768 ? 'Login / Sign Up' : 'Login'}
                            </button>
                        )}
                        
                        {/* Mobile Menu Button (Hamburger) */}
                        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </nav>

                {/* --- Mobile Menu Overlay --- */}
                <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                        <X size={28} onClick={() => setMobileMenuOpen(false)} style={{ cursor: 'pointer' }}/>
                    </div>
                    <span className="mobile-menu-item" onClick={() => {navigate('/'); setMobileMenuOpen(false);}}>Home</span>
                    <span className="mobile-menu-item" onClick={() => {navigate('/rooms'); setMobileMenuOpen(false);}}>Rooms & Suites</span>
                    <span className="mobile-menu-item" onClick={() => {navigate('/gallery'); setMobileMenuOpen(false);}}>Gallery</span>
                    <span className="mobile-menu-item" onClick={() => {navigate('/about'); setMobileMenuOpen(false);}}>About Us</span>
                    <span className="mobile-menu-item" onClick={() => {navigate('/contact'); setMobileMenuOpen(false);}}>Contact</span>
                    <button 
                        className="auth-btn" 
                        style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }} 
                        onClick={() => {
                            if (user) { handleDashboardClick(); } else { navigate('/login'); }
                            setMobileMenuOpen(false);
                        }}
                    >
                        {user ? (user.role === 'admin' ? 'Admin Panel' : 'My Dashboard') : 'Login / Sign Up'}
                    </button>
                </div>

                {/* --- 2. HERO SECTION --- */}
                <section className="hero-section">
                    <h1 className="hero-title">Experience Unmatched <br/> Luxury & Comfort</h1>
                    <p className="hero-sub">
                        Step into a world of elegance. Whether you are here for business or leisure, 
                        we ensure your stay is unforgettable.
                    </p>
                    <a 
                        className="hero-btn"
                        href="/rooms"
                        onClick={(e) => { e.preventDefault(); navigate('/rooms'); }}
                    >
                        Book Your Stay Now <ArrowRight size={22}/>
                    </a>
                </section>
                
                {/* --- 3. BOOKING SEARCH WIDGET --- */}
                <div className="booking-widget-container">
                    <div className="booking-widget">
                        {/* Check-in */}
                        <div className="form-group" style={{ maxWidth: '200px' }}>
                            <label className="form-label">Check In</label>
                            <input 
                                type="date" 
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        {/* Check-out */}
                        <div className="form-group" style={{ maxWidth: '200px' }}>
                            <label className="form-label">Check Out</label>
                            <input 
                                type="date" 
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        {/* Guests */}
                        <div className="form-group" style={{ maxWidth: '120px' }}>
                            <label className="form-label">Guests</label>
                            <select 
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="form-input form-select"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Button */}
                        <button 
                            onClick={handleSearch}
                            className="booking-btn"
                        >
                            <Search size={20}/> Check Availability
                        </button>
                    </div>
                </div>


                {/* --- 4. BRAND STORY / MINI ABOUT US --- */}
                <section className="section-padding bg-white" style={{ paddingTop: '80px' }}>
                    <div className="grid-3" style={{ gridTemplateColumns: window.innerWidth > 992 ? '1fr 2fr' : '1fr' }}>
                        <div style={{ textAlign: window.innerWidth > 992 ? 'left' : 'center', paddingRight: window.innerWidth > 992 ? '40px' : '0' }}>
                            <h4 style={{ color: '#d97706', fontWeight: '600', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Legacy</h4>
                            <h2 className="section-title" style={{ marginTop: '5px', fontSize: '32px' }}>The LuxuryStay Promise</h2>
                        </div>
                        <div style={{ paddingTop: window.innerWidth > 992 ? '10px' : '20px' }}>
                            <p className="section-sub" style={{ fontSize: '18px', marginBottom: '20px', color: '#4b5563' }}>
                                For over two decades, LuxuryStay has set the benchmark for global hospitality. We believe true luxury lies in personalized service and impeccable detail. 
                            </p>
                            <p className="section-sub">
                                From our sustainably sourced materials to our Michelin-starred dining, every element of your stay is curated for perfection. Experience the difference of dedicated elegance.
                            </p>
                            <button className="dashboard-btn" style={{ marginTop: '20px', backgroundColor: '#2563eb' }} onClick={() => navigate('/about')}>
                                Read Our Full Story <ArrowRight size={16}/>
                            </button>
                        </div>
                    </div>
                </section>


                {/* --- 5. FEATURED ROOMS --- (Now section 5) */}
                <section className="section-padding bg-light">
                    <div className="section-header">
                        <h2 className="section-title">Our Finest Accommodations</h2>
                        <p className="section-sub">Handpicked rooms for your perfect getaway.</p>
                    </div>

                    <div className="grid-3">
                        {featuredRooms.map(room => (
                            <div 
                                key={room.id} 
                                className="room-card"
                                onClick={() => navigate('/rooms')}
                            >
                                <img src={room.image} alt={room.name} className="room-img" />
                                <div className="room-content">
                                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                                        <div style={{ color:'#f59e0b', display:'flex', gap:'2px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < Math.floor(room.rating) ? "currentColor" : "none"} stroke="currentColor"/>
                                            ))}
                                        </div>
                                        <span style={{ fontSize:'12px', color:'#64748b', fontWeight: '600' }}>{room.rating}/5.0</span>
                                    </div>
                                    <h3 className="room-title">{room.name}</h3>
                                    <p className="room-price">${room.price} <span className="per-night">/ night</span></p>
                                    
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                                        {room.features.map((feat, idx) => (
                                            <span key={idx} className="feature-tag">{feat}</span>
                                        ))}
                                    </div>

                                    <button className="book-card-btn" onClick={(e) => {e.stopPropagation(); navigate('/rooms');}}>
                                        View & Book <CalendarCheck size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 6. AMENITIES --- */}
                <section className="section-padding bg-white">
                    <div className="section-header">
                        <h2 className="section-title">World-Class Amenities</h2>
                        <p className="section-sub">We redefine hospitality with world-class facilities and service.</p>
                    </div>
                    <div className="grid-3">
                        <div className="feature-box">
                            <div className="icon-circle star-icon"><Star size={32}/></div>
                            <h3 style={{fontWeight:'bold', marginBottom:'10px', fontSize:'20px'}}>5-Star Rated Service</h3>
                            <p style={{color:'#64748b'}}>Recognized globally for our exceptional service and hospitality.</p>
                        </div>
                        <div className="feature-box">
                            <div className="icon-circle utensils-icon"><Utensils size={32}/></div>
                            <h3 style={{fontWeight:'bold', marginBottom:'10px', fontSize:'20px'}}>Gourmet Dining</h3>
                            <p style={{color:'#64748b'}}>Experience gourmet dishes crafted by top international chefs 24/7.</p>
                        </div>
                        <div className="feature-box">
                            <div className="icon-circle wifi-icon"><Wifi size={32}/></div>
                            <h3 style={{fontWeight:'bold', marginBottom:'10px', fontSize:'20px'}}>High-Speed WiFi</h3>
                            <p style={{color:'#64748b'}}>Complimentary high-speed internet access in all rooms and public areas.</p>
                        </div>
                    </div>
                </section>

                {/* --- 7. GALLERY PREVIEW --- */}
                <section className="section-padding bg-light">
                    <div className="section-header">
                        <h2 className="section-title">Glimpse Into Luxury</h2>
                        <p className="section-sub">Our curated spaces captured through the lens.</p>
                    </div>
                    <div className="grid-4">
                        {galleryImages.map((src, index) => (
                            <img 
                                key={index}
                                src={src} 
                                alt={`Gallery Image ${index + 1}`} 
                                className="gallery-img"
                                onClick={() => navigate('/gallery')}
                            />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button className="dashboard-btn" style={{ backgroundColor: '#1e293b' }} onClick={() => navigate('/gallery')}>
                            View Full Gallery <Hotel size={16}/>
                        </button>
                    </div>
                </section>
                
                {/* --- 8. TESTIMONIALS/GUEST REVIEW --- */}
                <section className="section-padding bg-white">
                    <div className="section-header">
                        <h2 className="section-title">What Our Guests Say</h2>
                        <p className="section-sub">Trusted reviews from happy travelers worldwide.</p>
                    </div>
                    <div className="grid-3" style={{ gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr' }}>
                        {testimonials.map(t => (
                            <div key={t.id} className="testimonial-card">
                                <Quote size={40} style={{ color: '#bfdbfe', marginBottom: '15px' }} strokeWidth={1}/>
                                <p className="quote-text">{t.quote}</p>
                                <div className="author-info">
                                    <div className="avatar">{t.author[0]}</div>
                                    <div>
                                        <h4 style={{fontWeight: 'bold', color: '#1e293b'}}>{t.author}</h4>
                                        <p style={{fontSize: '14px', color: '#64748b'}}><MapPin size={12} style={{marginRight: '5px'}}/>{t.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 9. CTA STRIP --- */}
                <div className="cta-strip" style={{ marginBottom: '80px' }}>
                    <div>
                        <h3 className="cta-strip-title">Book Direct & Save</h3>
                        <p className="footer-text" style={{ marginTop: '5px' }}>Check availability and guarantee the best rates only on our website.</p>
                    </div>
                    <button 
                        className="cta-strip-btn" 
                        onClick={() => navigate('/rooms')}
                    >
                        Check Rates Today <ArrowRight size={20}/>
                    </button>
                </div>


                {/* --- 10. FOOTER --- */}
                <footer className="footer">
                    <div className="footer-grid">
                        <div>
                            <h2 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'20px'}}>LuxuryStay</h2>
                            <p className="footer-text">
                                123 Luxury Ave, Beverly Hills<br/>
                                California, 90210<br/>
                                <br/>
                                **Reservations:** +1 (234) 567-8900<br/>
                                **Email:** info@luxurystay.com
                            </p>
                        </div>
                        <div>
                            <h3 className="footer-link-title">Quick Links</h3>
                            <p className="footer-link" onClick={() => navigate('/rooms')}>Rooms & Suites</p>
                            <p className="footer-link" onClick={() => navigate('/gallery')}>Gallery</p>
                            <p className="footer-link" onClick={() => navigate('/about')}>About Us</p>
                            <p className="footer-link" onClick={() => navigate('/contact')}>Contact</p>
                        </div>
                        
                        <div style={{ paddingRight: '20px' }}>
                            <h3 className="footer-link-title">Stay Connected</h3>
                            <p className="footer-text" style={{ marginBottom: '10px' }}>Follow us on social media for exclusive deals.</p>
                            <div style={{ display: 'flex', gap: '15px', color: 'white', fontSize: '24px' }}>
                                {/* Note: You need to include Font Awesome or similar library for these icons */}
                                <Star size={24} style={{ cursor: 'pointer' }} />
                                <Star size={24} style={{ cursor: 'pointer' }} />
                                <Star size={24} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>
                    </div>
                    <p style={{ textAlign:'center', marginTop:'50px', opacity:0.4, fontSize:'13px', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'20px'}}>
                        © 2025 LuxuryStay Hospitality. All rights reserved.
                    </p>
                </footer>

            </div>
        </>
    );
};

export default Home;