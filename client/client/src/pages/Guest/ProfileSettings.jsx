import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name, phone: user?.phone });

  const handleUpdate = async () => {
    try {
        await axios.put('http://localhost:5000/api/v1/users/profile', form);
        alert("Updated!");
    } catch(e) { alert("Error"); }
  };

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2>Edit Profile</h2>
            <label style={{ display: 'block', marginTop: '20px' }}>Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            
            <label style={{ display: 'block', marginTop: '15px' }}>Phone</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
            
            <button onClick={handleUpdate} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '12px', marginTop: '20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Changes</button>
        </div>
    </div>
  );
};

export default ProfileSettings;