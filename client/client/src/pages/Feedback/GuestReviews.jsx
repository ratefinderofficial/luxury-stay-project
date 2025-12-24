import React, { useEffect, useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Trash2, 
  Filter, 
  MoreHorizontal,
  Reply
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// API & Hooks
import { feedbackAPI } from '../../api/feedbackAPI';
import useAxios from '../../hooks/useAxios';

// Components
import PageHeader from '../../components/Layout/PageHeader';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import Avatar from '../../components/UI/Avatar';

const GuestReviews = () => {
  const { execute, loading, data, error } = useAxios();
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('All');

  // 1. Fetch Reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await execute(feedbackAPI.getAllFeedback);
        // Agar API array return kare toh set karo, warna empty array
        setReviews(result.reviews || result || []); 
      } catch (err) {
        // Error handled by hook
      }
    };
    fetchData();
  }, [execute]);

  // 2. Calculate Stats (Average Rating)
  const calculateStats = () => {
    if (!reviews.length) return { average: 0, total: 0, fiveStar: 0 };
    
    const total = reviews.length;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const fiveStar = reviews.filter(r => r.rating === 5).length;
    
    return {
      average: (sum / total).toFixed(1),
      total,
      fiveStar
    };
  };

  const stats = calculateStats();

  // 3. Filter Logic
  const filteredReviews = filterRating === 'All' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  // 4. Delete Handler (Moderation)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      await feedbackAPI.deleteFeedback(id);
      setReviews(reviews.filter(r => r._id !== id));
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  // Helper: Render Star Icons
  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "fill-current" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };

  if (loading && !reviews.length) return <div className="h-screen flex items-center justify-center"><Loader size="large"/></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <PageHeader 
        title="Guest Feedback" 
        subtitle="Monitor guest satisfaction and service quality"
        breadcrumbs={['Dashboard', 'Feedback']}
      />

      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Rating */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Average Rating</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.average} <span className="text-sm text-gray-400 font-normal">/ 5.0</span></h3>
          </div>
          <div className="p-4 bg-yellow-50 rounded-full text-yellow-500">
            <Star size={28} className="fill-current" />
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Reviews</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</h3>
          </div>
          <div className="p-4 bg-blue-50 rounded-full text-blue-500">
            <MessageSquare size={28} />
          </div>
        </div>

        {/* Happy Guests */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">5 Star Reviews</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.fiveStar}</h3>
          </div>
          <div className="p-4 bg-green-50 rounded-full text-green-500">
            <ThumbsUp size={28} />
          </div>
        </div>
      </div>

      {/* 2. Filters & Content */}
      <div className="flex flex-col gap-6">
        
        {/* Toolbar */}
        <div className="flex justify-end">
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <Filter size={16} className="text-gray-400 ml-2" />
            <select 
              className="text-sm border-none focus:ring-0 text-gray-700 bg-transparent"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <Card key={review._id} className="hover:shadow-md transition-shadow duration-200">
                <div className="flex gap-4">
                  
                  {/* Guest Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar name={review.guestName} size="lg" />
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">{review.guestName}</h4>
                        <p className="text-xs text-gray-500">
                          Stayed in <span className="font-medium">Room {review.roomNumber}</span> • {format(new Date(review.createdAt || Date.now()), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                           {renderStars(review.rating)}
                         </div>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-sm">
                      "{review.comment}"
                    </p>

                    {/* Actions Area */}
                    <div className="pt-3 flex gap-3">
                        <button className="text-xs flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                            <Reply size={14} /> Reply to Guest
                        </button>
                        
                        {/* Only Admin can delete */}
                        <button 
                            onClick={() => handleDelete(review._id)}
                            className="text-xs flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors ml-auto"
                        >
                            <Trash2 size={14} /> Delete Review
                        </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No reviews found matching your filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestReviews;