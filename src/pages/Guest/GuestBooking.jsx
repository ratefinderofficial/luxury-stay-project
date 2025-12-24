import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CreditCard, CheckCircle, Hotel, User, Phone, MapPin, Hash, Key } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';

const GuestBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null); // Booking confirm hone ke baad data yahan ayega

  // Form State
  const [formData, setFormData] = useState({
    guestName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cnic: '',
    address: ''
  });

  if (!state || !state.room) {
    return <div className="p-10 text-center"><h2>No Data</h2><button onClick={() => navigate('/rooms')}>Go Back</button></div>;
  }

  const { room, checkInDate, checkOutDate, totalAmount, nights } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check Real ID (Mock Data Crash Fix)
    if (!room._id || room._id.toString().length < 20) {
        return toast.error("Error: Invalid Room Data. Please use real rooms from database.");
    }

    setLoading(true);
    try {
        const payload = {
            room: room._id, // Real MongoDB ID
            user: user._id,
            checkInDate,
            checkOutDate,
            totalAmount,
            ...formData // Name, CNIC, Phone sab spread kar diya
        };

        const res = await axios.post('http://localhost:5000/api/v1/bookings', payload);
        
        // Success hone par Key dikhao
        setSuccessData(res.data.booking);
        toast.success("🎉 Booking Confirmed!");

    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Booking Failed");
    } finally {
        setLoading(false);
    }
  };

  // --- IF SUCCESS (Show Digital Key) ---
  if (successData) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl text-center border border-green-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-green-600"/>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-6">Your room is ready. Use this key to enter.</p>
                
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
                    <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">Your Digital Key</p>
                    <div className="text-4xl font-mono font-bold text-blue-800 tracking-widest flex items-center justify-center gap-3">
                        <Key size={30}/> {successData.digitalKey}
                    </div>
                </div>

                <button onClick={() => navigate('/guest/dashboard')} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
  }

  // --- BOOKING FORM ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center font-[sans-serif]">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT: FORM */}
        <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-bold text-gray-800">Finalize Booking</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><User size={20}/> Guest Details</h3>
                <form id="bookingForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                        <input type="text" required className="w-full p-3 border rounded-lg bg-gray-50" 
                            value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
                        <input type="email" required className="w-full p-3 border rounded-lg bg-gray-50" 
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
                        <input type="text" required placeholder="+92..." className="w-full p-3 border rounded-lg bg-gray-50" 
                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">CNIC / ID Number</label>
                        <input type="text" required placeholder="42101-..." className="w-full p-3 border rounded-lg bg-gray-50" 
                            value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
                        <input type="text" placeholder="House No, Street..." className="w-full p-3 border rounded-lg bg-gray-50" 
                            value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>

                </form>
            </div>

            <button form="bookingForm" type="submit" disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all text-lg flex justify-center items-center gap-2">
                {loading ? "Processing..." : <><CheckCircle/> Confirm & Get Key</>}
            </button>
        </div>

        {/* RIGHT: SUMMARY CARD */}
        <div className="h-fit sticky top-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
                
                <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
                    <img src={room.images?.[0]} className="w-20 h-20 rounded-lg object-cover" alt="Room"/>
                    <div>
                        <div className="font-bold text-gray-800">{room.name}</div>
                        <div className="text-sm text-gray-500">{room.type || 'Deluxe'}</div>
                        <div className="text-sm font-bold text-blue-600 mt-1">${room.price} / night</div>
                    </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex justify-between"><span>Check-In</span> <strong>{checkInDate}</strong></div>
                    <div className="flex justify-between"><span>Check-Out</span> <strong>{checkOutDate}</strong></div>
                    <div className="flex justify-between"><span>Duration</span> <strong>{nights} Nights</strong></div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-700">${totalAmount}</span>
                </div>
                
                <div className="mt-4 bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg flex items-start gap-2">
                    <Hotel size={14} className="mt-0.5"/>
                    Payment will be collected at the hotel reception upon arrival.
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default GuestBooking;