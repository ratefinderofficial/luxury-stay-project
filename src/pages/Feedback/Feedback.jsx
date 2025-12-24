import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Trash2, Loader, Plus, MessageSquare, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Data
  const fetchFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/feedback');
      setFeedbacks(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/feedback/${id}`);
      setFeedbacks(feedbacks.filter(item => item._id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // Scroll Style
  const scrollStyle = {
    height: 'calc(100vh - 80px)',
    overflowY: 'auto',
    paddingBottom: '50px'
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-blue-600 h-10 w-10"/>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8" style={scrollStyle}>
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Guest Reviews</h1>
                <p className="text-gray-500 mt-1">Manage feedback and monitor guest satisfaction.</p>
            </div>
            
            <button 
                onClick={() => navigate('/feedback/add')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2 transform active:scale-95"
            >
                <Plus size={20}/> Add New Review
            </button>
        </div>

        {/* --- STATS BAR (Optional decoration) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><MessageSquare size={24}/></div>
                <div>
                    <p className="text-gray-500 text-sm">Total Reviews</p>
                    <h3 className="text-2xl font-bold text-gray-800">{feedbacks.length}</h3>
                </div>
            </div>
            {/* You can add more stats here later */}
        </div>

        {/* --- REVIEWS GRID --- */}
        {feedbacks.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
             <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-gray-400" size={30}/>
             </div>
             <h3 className="text-lg font-semibold text-gray-900">No reviews yet</h3>
             <p className="text-gray-500 mb-6">Start collecting feedback from your guests.</p>
             <button onClick={() => navigate('/feedback/add')} className="text-blue-600 font-medium hover:underline">Add First Review</button>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((item) => (
              <div key={item._id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                
                {/* Decorative background gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                            {item.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{item.guestName}</h3>
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md mt-1">Room {item.roomNumber}</span>
                        </div>
                    </div>
                    
                    {/* Delete Icon */}
                    <button 
                        onClick={() => handleDelete(item._id)} 
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                        title="Delete Review"
                    >
                        <Trash2 size={18}/>
                    </button>
                </div>

                {/* Rating Stars */}
                <div className="flex text-yellow-400 mb-3 bg-yellow-50 w-max px-2 py-1 rounded-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < item.rating ? "currentColor" : "none"} stroke="currentColor" />
                    ))}
                    <span className="text-gray-400 text-xs ml-2 font-medium">({item.rating}.0)</span>
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">"{item.comment}"</p>

                {/* Date Footer */}
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                    <span>Posted on</span>
                    <span>{new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;