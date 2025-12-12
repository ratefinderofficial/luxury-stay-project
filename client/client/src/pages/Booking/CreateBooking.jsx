import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Check, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

// API
import { roomAPI } from '../../api/roomAPI';
import { bookingAPI } from '../../api/bookingAPI';
import { userAPI } from '../../api/userAPI'; // Assuming we need to find guests
import useAxios from '../../hooks/useAxios';

// Components
import PageHeader from '../../components/Layout/PageHeader';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';

const CreateBooking = () => {
  const navigate = useNavigate();
  
  // Step Logic
  const [step, setStep] = useState(1); // 1: Dates, 2: Room, 3: Guest, 4: Confirm

  // Form Data
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestInfo, setGuestInfo] = useState(null);

  // Hooks
  const { execute: fetchRooms, loading: roomLoading, data: availableRooms } = useAxios();
  const { execute: findGuest, loading: guestLoading } = useAxios();
  const { execute: createBooking, loading: submitLoading } = useAxios();

  // --- Handlers ---

  // Step 1 -> 2: Check Availability
  const handleCheckAvailability = () => {
    if (!dates.checkIn || !dates.checkOut) return toast.error("Please select dates");
    
    fetchRooms(roomAPI.getRooms, { 
      status: 'Available', 
      // Real backend should filter by date range availability
      availableFrom: dates.checkIn,
      availableTo: dates.checkOut
    });
    setStep(2);
  };

  // Step 2 -> 3: Select Room
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setStep(3);
  };

  // Step 3 -> 4: Find Guest
  const handleGuestSearch = async () => {
    try {
      // Assuming backend has search user by email
      const users = await findGuest(userAPI.getAllUsers, { email: guestEmail, role: 'guest' });
      if (users && users.length > 0) {
        setGuestInfo(users[0]);
        toast.success("Guest found!");
      } else {
        toast.error("Guest not found. Register them first.");
        // Optional: Navigate to registration modal
      }
    } catch (err) {
      toast.error("Error searching guest");
    }
  };

  // Final Step: Submit
  const handleConfirmBooking = async () => {
    try {
      await createBooking(bookingAPI.createBooking, {
        roomId: selectedRoom._id,
        guestId: guestInfo._id,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        status: 'Confirmed'
      });
      toast.success("Booking Created Successfully!");
      navigate('/bookings');
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader 
        title="New Reservation" 
        breadcrumbs={['Bookings', 'New']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Wizard Steps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: Dates */}
          <Card title="1. Stay Dates" className={step === 1 ? 'ring-2 ring-primary' : ''}>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="date" 
                label="Check In" 
                value={dates.checkIn} 
                onChange={e => setDates({...dates, checkIn: e.target.value})} 
              />
              <Input 
                type="date" 
                label="Check Out" 
                value={dates.checkOut} 
                onChange={e => setDates({...dates, checkOut: e.target.value})} 
              />
            </div>
            {step === 1 && (
              <div className="mt-4 text-right">
                <Button onClick={handleCheckAvailability} isLoading={roomLoading}>
                  Check Availability
                </Button>
              </div>
            )}
          </Card>

          {/* STEP 2: Room Selection */}
          {step >= 2 && (
            <Card title="2. Select Room" className={step === 2 ? 'ring-2 ring-primary' : ''}>
              {roomLoading ? <Loader /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableRooms?.rooms?.map(room => (
                    <div 
                      key={room._id}
                      onClick={() => handleRoomSelect(room)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md
                        ${selectedRoom?._id === room._id ? 'bg-blue-50 border-primary' : 'bg-white border-gray-200'}
                      `}
                    >
                      <h4 className="font-bold text-gray-800">Room {room.roomNumber}</h4>
                      <p className="text-sm text-gray-500">{room.type}</p>
                      <p className="font-bold text-primary mt-2">${room.price} <span className="text-xs text-gray-400">/night</span></p>
                    </div>
                  ))}
                  {availableRooms?.rooms?.length === 0 && <p className="text-red-500">No rooms available for these dates.</p>}
                </div>
              )}
            </Card>
          )}

          {/* STEP 3: Guest Details */}
          {step >= 3 && (
            <Card title="3. Guest Info" className={step === 3 ? 'ring-2 ring-primary' : ''}>
               <div className="flex gap-4 items-end">
                 <Input 
                   label="Guest Email" 
                   placeholder="guest@example.com" 
                   value={guestEmail}
                   onChange={e => setGuestEmail(e.target.value)}
                   className="flex-1"
                 />
                 <Button onClick={handleGuestSearch} isLoading={guestLoading}>
                   <Search size={18} />
                 </Button>
               </div>
               {guestInfo && (
                 <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
                   <Check size={18} /> Found: <strong>{guestInfo.name}</strong> ({guestInfo.phone})
                 </div>
               )}
            </Card>
          )}

        </div>

        {/* RIGHT: Summary Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Booking Summary</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Dates</span>
                <span className="font-medium text-right">{dates.checkIn || '-'} to <br/> {dates.checkOut || '-'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Room</span>
                <span className="font-medium">{selectedRoom ? `Room ${selectedRoom.roomNumber}` : '-'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Guest</span>
                <span className="font-medium">{guestInfo ? guestInfo.name : '-'}</span>
              </div>

              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total Est.</span>
                  <span>
                    {selectedRoom && dates.checkIn && dates.checkOut 
                      ? `$${selectedRoom.price * Math.ceil((new Date(dates.checkOut) - new Date(dates.checkIn)) / (86400000))}`
                      : '$0.00'
                    }
                  </span>
                </div>
              </div>

              <Button 
                className="w-full mt-4 py-3" 
                onClick={handleConfirmBooking}
                disabled={!guestInfo || !selectedRoom || !dates.checkIn}
                isLoading={submitLoading}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateBooking;