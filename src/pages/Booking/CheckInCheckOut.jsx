import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogIn, LogOut, CreditCard, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// API
import { bookingAPI } from '../../api/bookingAPI';
import useAxios from '../../hooks/useAxios';

// Components
import PageHeader from '../../components/Layout/PageHeader';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Loader from '../../components/UI/Loader';

const CheckInCheckOut = () => {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);

  const { execute: getBooking, loading: searchLoading } = useAxios();
  const { execute: processAction, loading: actionLoading } = useAxios();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingId) return;
    try {
      // Assuming getBookingById supports search by ID string
      const data = await getBooking(bookingAPI.getBookingById, bookingId);
      setBooking(data);
    } catch (err) {
      setBooking(null);
      toast.error("Booking not found");
    }
  };

  const handleCheckIn = async () => {
    try {
      await processAction(bookingAPI.checkIn, booking._id);
      toast.success(`Check-In Successful! Room ${booking.roomNumber} Key Assigned.`);
      // Refresh data
      const updated = { ...booking, status: 'Checked In' };
      setBooking(updated);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleCheckOut = async () => {
    try {
      // Usually Check-out redirects to billing first
      // But if paid, we process checkout
      await processAction(bookingAPI.checkOut, booking._id);
      toast.success("Check-Out Successful. Room marked for cleaning.");
      
      // Navigate to generate final bill
      navigate(`/billing/generate?bookingId=${booking._id}`);
    } catch (err) {
       // Error handled by hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Reception Desk" 
        subtitle="Process Check-Ins and Check-Outs"
        breadcrumbs={['Dashboard', 'Reception']}
      />

      {/* Search Section */}
      <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Reservation</h2>
        <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
          <Input 
            placeholder="Enter Booking ID (e.g. BK-1234)" 
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="text-lg"
          />
          <Button type="submit" size="lg" isLoading={searchLoading}>
            <Search size={20} />
          </Button>
        </form>
      </div>

      {/* Result Section */}
      {booking && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            
            {/* Booking Info */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-gray-800">{booking.guestName}</h3>
                <Badge type={booking.status === 'Checked In' ? 'success' : 'info'}>{booking.status}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                <p>Booking ID:</p> <p className="font-mono font-medium text-gray-900">{booking._id}</p>
                <p>Room Type:</p> <p className="font-medium text-gray-900">{booking.roomType}</p>
                <p>Room Number:</p> <p className="font-medium text-gray-900 text-lg">#{booking.roomNumber}</p>
                <p>Duration:</p> <p className="font-medium text-gray-900">
                   {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 justify-center min-w-[200px] border-l pl-6 border-gray-100">
              
              {/* Logic: If Confirmed -> Show Check In */}
              {booking.status === 'Confirmed' && (
                <Button 
                  onClick={handleCheckIn} 
                  isLoading={actionLoading}
                  className="w-full py-4 text-lg bg-green-600 hover:bg-green-700"
                >
                  <Key size={20} className="mr-2" /> Check In Guest
                </Button>
              )}

              {/* Logic: If Checked In -> Show Check Out */}
              {booking.status === 'Checked In' && (
                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckOut} 
                    isLoading={actionLoading}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-900"
                  >
                    <LogOut size={20} className="mr-2" /> Process Check-Out
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/billing/generate?bookingId=${booking._id}`)}
                  >
                    <CreditCard size={18} className="mr-2" /> View Bill
                  </Button>
                </div>
              )}

              {/* If Cancelled/Completed */}
              {['Cancelled', 'Checked Out'].includes(booking.status) && (
                <div className="text-center text-gray-500 py-4 italic">
                  No actions available for this status.
                </div>
              )}
            </div>

          </div>
        </Card>
      )}
    </div>
  );
};

export default CheckInCheckOut;