import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Wifi, Car, Utensils, Shirt, Phone, ArrowLeft } from 'lucide-react';

const GuestServices = () => {
  const navigate = useNavigate();

  const services = [
    { id: 1, title: 'Dining', icon: <Utensils size={28}/>, desc: '24/7 Room Service', color: '#d97706', bg: '#fef3c7' },
    { id: 2, title: 'Laundry', icon: <Shirt size={28}/>, desc: 'Dry Cleaning', color: '#2563eb', bg: '#dbeafe' },
    { id: 3, title: 'Transport', icon: <Car size={28}/>, desc: 'Airport Pickup', color: '#059669', bg: '#d1fae5' },
    { id: 4, title: 'Wi-Fi', icon: <Wifi size={28}/>, desc: 'High Speed Net', color: '#7c3aed', bg: '#ede9fe' },
  ];

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <button onClick={() => navigate('/guest/dashboard')} style={{ border:'none', background:'none', cursor:'pointer', marginBottom: 20 }}>
        <ArrowLeft size={24}/>
      </button>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Hotel Services</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
        {services.map(s => (
            <div key={s.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                    {s.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{s.desc}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default GuestServices;