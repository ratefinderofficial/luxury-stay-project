import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Phone, Mail, MapPin, X, User } from 'lucide-react';

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', idNumber: '', preferences: ''
  });

  const fetchGuests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/guests?search=${searchTerm}`);
      setGuests(res.data);
      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchGuests(), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/guests', formData);
      alert("✅ Guest Added!");
      setShowModal(false);
      fetchGuests();
      setFormData({ name: '', email: '', phone: '', address: '', idNumber: '', preferences: '' });
    } catch (error) { alert("Error adding guest"); }
  };

  const styles = {
    container: { padding: '30px', backgroundColor: '#f8fafc', height: 'calc(100vh - 80px)', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#1e293b' },
    addBtn: { backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', gap: '10px', fontWeight: 'bold' },
    searchBox: { padding: '12px', width: '350px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 1000 },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Guest Management</h1>
        <button style={styles.addBtn} onClick={() => setShowModal(true)}><Plus size={20}/> Add Guest</button>
      </div>

      <input type="text" placeholder="Search Guest..." style={styles.searchBox} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

      <div style={styles.grid}>
        {guests.map((g) => (
          <div key={g._id} style={styles.card}>
             <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px', borderBottom:'1px solid #f1f5f9', paddingBottom:'15px'}}>
                <div style={{width:'50px', height:'50px', borderRadius:'50%', backgroundColor:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', color:'#2563eb'}}>{g.name.charAt(0)}</div>
                <div><h3 style={{fontWeight:'bold', fontSize:'18px'}}>{g.name}</h3><p style={{fontSize:'12px', color:'#64748b'}}>ID: {g.idNumber}</p></div>
             </div>
             <p style={{marginBottom:'8px', display:'flex', gap:'10px', fontSize:'14px', color:'#475569'}}><Phone size={16}/> {g.phone}</p>
             <p style={{marginBottom:'8px', display:'flex', gap:'10px', fontSize:'14px', color:'#475569'}}><Mail size={16}/> {g.email}</p>
             {g.preferences && <span style={{backgroundColor:'#fef3c7', padding:'5px 10px', borderRadius:'5px', fontSize:'12px', fontWeight:'bold', color:'#b45309'}}>⭐ {g.preferences}</span>}
          </div>
        ))}
      </div>

      {showModal && (
        <>
        <div style={styles.overlay} onClick={() => setShowModal(false)}></div>
        <div style={styles.modal}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}><h2>New Guest</h2><X style={{cursor:'pointer'}} onClick={() => setShowModal(false)}/></div>
            <form onSubmit={handleAddGuest}>
                <input style={styles.input} placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input style={styles.input} placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                <input style={styles.input} placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input style={styles.input} placeholder="ID Number" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
                <input style={styles.input} placeholder="Preferences (e.g. Low Floor)" value={formData.preferences} onChange={e => setFormData({...formData, preferences: e.target.value})} />
                <button type="submit" style={{...styles.addBtn, width:'100%', justifyContent:'center'}}>Save Guest</button>
            </form>
        </div>
        </>
      )}
    </div>
  );
};

export default GuestList;