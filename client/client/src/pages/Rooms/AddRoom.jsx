import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Upload, BedDouble, Wind, CheckSquare, Layout } from 'lucide-react';
import axios from 'axios'; // 👈 YEH IMPORT ZAROORI HAI
import PageHeader from '../../components/Layout/PageHeader';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const AddRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For Edit Mode

  // --- STATE ---
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'Standard',
    price: '',
    capacity: 2,
    bedType: 'Queen',
    isAC: true,
    status: 'Available',
    description: '',
    amenities: [] 
  });

  const [imageFiles, setImageFiles] = useState([]);

  // --- EDIT MODE DATA FETCH ---
  useEffect(() => {
    if (id) {
        axios.get(`http://localhost:5000/api/v1/rooms/${id}`)
             .then(res => setFormData(res.data))
             .catch(err => console.error(err));
    }
  }, [id]);

  // --- CONSTANTS ---
  const amenityOptions = ['WiFi', 'TV', 'Mini-Fridge', 'Balcony', 'Room Service', 'Hot Water', 'Jacuzzi', 'Work Desk'];
  const bedOptions = ['Single', 'Double', 'Queen', 'King', 'Twin'];

  // --- HANDLERS ---
  const handleAmenityChange = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.roomNumber || !formData.price || !formData.description) {
        return toast.error("Please fill all required fields.");
    }

    // JSON Payload
    const roomPayload = {
        roomNumber: formData.roomNumber,
        type: formData.type,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        currentStatus: formData.status, // Backend field name check karlena (currentStatus vs status)
        bedType: formData.bedType,
        isAC: formData.isAC,
        description: formData.description,
        amenities: formData.amenities,
        images: [] 
    };

    try {
      if (id) {
        // Update logic
        await axios.put(`http://localhost:5000/api/v1/rooms/${id}`, roomPayload);
        toast.success("Room Updated Successfully!");
      } else {
        // Create logic
        await axios.post('http://localhost:5000/api/v1/rooms', roomPayload);
        toast.success("Room Added Successfully!");
      }
      navigate('/admin/rooms'); 
    } catch (err) {
      console.error(err);
      if(err.response && err.response.data && err.response.data.message.includes("duplicate")) {
          toast.error("Error: Room Number already exists!");
      } else {
          toast.error(err.response?.data?.message || "Failed to save room.");
      }
    }
  };

  // --- STYLES ---
  const styles = {
    container: { 
        width: '100%', // 👈 FIXED: 250% se 100% kiya
        maxWidth: '900px', 
        margin: '0 auto', 
        height: 'calc(100vh - 80px)', 
        overflowY: 'auto', 
        padding: '20px' 
    },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '40px' },
    sectionTitle: { fontSize: '14px', fontWeight: '700', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
    formGrid: { padding: '30px', display: 'grid', gap: '25px' },
    row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' },
    
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: 'white', cursor: 'pointer' },
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', minHeight: '100px', resize: 'vertical' },
    
    checkboxGroup: { display: 'flex', flexWrap: 'wrap', gap: '15px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', transition: 'all 0.2s' },
    checkboxActive: { backgroundColor: '#eff6ff', borderColor: '#1e3a8a', color: '#1e3a8a', fontWeight: '600' },
    
    uploadBox: { border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '30px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f8fafc' },
    footer: { padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '15px', backgroundColor: '#f8fafc' }
  };

  return (
    <div style={styles.container}>
      <PageHeader title={id ? "Edit Room Details" : "Add New Room"} subtitle="Enter room specifications and amenities" breadcrumbs={['Rooms', 'Add']} />
      
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.formGrid}>
            
            {/* Basic Info */}
            <div>
                <div style={styles.sectionTitle}><Layout size={16}/> Basic Information</div>
                <div style={styles.row2}>
                    <div>
                        <label style={styles.label}>Room Number</label>
                        <input type="text" style={styles.input} placeholder="e.g. 101" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} required />
                    </div>
                    <div>
                        <label style={styles.label}>Room Type</label>
                        <select style={styles.select} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                            <option>Standard</option><option>Deluxe</option><option>Suite</option><option>Family</option><option>Penthouse</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Pricing & Capacity */}
            <div style={styles.row3}>
                <div>
                    <label style={styles.label}>Price per Night ($)</label>
                    <input type="number" style={styles.input} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div>
                    <label style={styles.label}>Max Capacity</label>
                    <input type="number" style={styles.input} value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                </div>
                <div>
                    <label style={styles.label}>Current Status</label>
                    <select style={styles.select} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Under Maintenance</option>
                        <option value="Cleaning">Cleaning</option>
                    </select>
                </div>
            </div>

            {/* Features (Bed, AC) */}
            <div>
                <div style={styles.sectionTitle}><BedDouble size={16}/> Bed & Climate</div>
                <div style={styles.row2}>
                    <div>
                        <label style={styles.label}>Bed Type</label>
                        <select style={styles.select} value={formData.bedType} onChange={e => setFormData({...formData, bedType: e.target.value})}>
                            {bedOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Air Conditioning</label>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input type="radio" name="isAC" checked={formData.isAC} onChange={() => setFormData({...formData, isAC: true})} /> Yes (AC)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input type="radio" name="isAC" checked={!formData.isAC} onChange={() => setFormData({...formData, isAC: false})} /> No (Non-AC)
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Amenities */}
            <div>
                <div style={styles.sectionTitle}><CheckSquare size={16}/> Amenities</div>
                <div style={styles.checkboxGroup}>
                    {amenityOptions.map(am => (
                        <div 
                            key={am} 
                            style={{ ...styles.checkboxLabel, ...(formData.amenities.includes(am) ? styles.checkboxActive : {}) }}
                            onClick={() => handleAmenityChange(am)}
                        >
                            {am}
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <label style={styles.label}>Room Description</label>
                <textarea style={styles.textarea} placeholder="Describe the view, decor, and unique features..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>

            {/* Image Upload */}
            <div>
                <div style={styles.sectionTitle}><Upload size={16}/> Room Images</div>
                <div style={styles.uploadBox} onClick={() => document.getElementById('fileInput').click()}>
                    <Upload size={32} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                    <p style={{ color: '#64748b', margin: 0 }}>Click to upload images</p>
                    <input id="fileInput" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </div>
                {imageFiles.length > 0 && (
                    <p style={{ fontSize: '13px', color: 'green', marginTop: '10px' }}>{imageFiles.length} files selected</p>
                )}
            </div>

        </div>

        {/* Footer */}
        <div style={styles.footer}>
            <Button variant="outline" type="button" onClick={() => navigate('/admin/rooms')}>Cancel</Button>
            <Button type="submit"><Save size={18} style={{ marginRight: '8px' }} /> Save Room</Button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;