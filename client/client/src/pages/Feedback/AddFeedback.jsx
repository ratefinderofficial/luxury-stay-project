import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, User, Hash, ArrowLeft, Send } from 'lucide-react';

const AddFeedback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    rating: 5,
    comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/v1/feedback', formData);
      // Thoda delay taake user ko loading dikhe (UX acha lagta hai)
      setTimeout(() => {
        alert("✨ Feedback Added Successfully!");
        navigate('/feedback'); 
      }, 500);
    } catch (error) {
      alert("Error adding feedback");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white">
            <button 
                onClick={() => navigate('/feedback')} 
                className="text-blue-100 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors"
            >
                <ArrowLeft size={16}/> Back to Reviews
            </button>
            <h2 className="text-3xl font-bold">Share Experience</h2>
            <p className="text-blue-100 mt-2 opacity-90">Please fill the details below to log a guest review.</p>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Guest Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            required 
                            placeholder="e.g. Ali Khan"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800" 
                            value={formData.guestName} 
                            onChange={e => setFormData({...formData, guestName: e.target.value})} 
                        />
                    </div>
                </div>

                {/* Room & Rating Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Room Number</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                required 
                                placeholder="e.g. 101"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                                value={formData.roomNumber} 
                                onChange={e => setFormData({...formData, roomNumber: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Rating</label>
                        <div className="relative">
                            <Star className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <select 
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 cursor-pointer appearance-none"
                                value={formData.rating} 
                                onChange={e => setFormData({...formData, rating: e.target.value})}
                            >
                                <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
                                <option value="4">⭐⭐⭐⭐ Good (4)</option>
                                <option value="3">⭐⭐⭐ Average (3)</option>
                                <option value="2">⭐⭐ Poor (2)</option>
                                <option value="1">⭐ Terrible (1)</option>
                            </select>
                            {/* Custom Arrow Icon */}
                            <div className="absolute right-4 top-4 pointer-events-none text-gray-500 text-xs">▼</div>
                        </div>
                    </div>
                </div>

                {/* Comment Area */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Feedback / Comment</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <textarea 
                            required 
                            rows="4" 
                            placeholder="What did the guest say?"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 resize-none"
                            value={formData.comment} 
                            onChange={e => setFormData({...formData, comment: e.target.value})}
                        ></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-300 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>Saving...</>
                    ) : (
                        <><Send size={20} /> Submit Feedback</>
                    )}
                </button>

            </form>
        </div>
      </div>
    </div>
  );
};

export default AddFeedback;