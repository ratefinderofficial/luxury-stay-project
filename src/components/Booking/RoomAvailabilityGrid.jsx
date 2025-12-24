import React, { useState } from 'react';
import { format, addDays, isSameDay, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

/**
 * @param {Array} rooms - Room objects [{id, number, type, status}]
 * @param {Array} bookings - Booking objects [{roomId, checkIn, checkOut, guestName}]
 */
const RoomAvailabilityGrid = ({ rooms = [], bookings = [] }) => {
  const [startDate, setStartDate] = useState(new Date());
  const daysToShow = 14; // Grid mein kitne din dikhane hain

  // Generate date headers
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i));

  // Navigate Timeline
  const handlePrev = () => setStartDate(addDays(startDate, -7));
  const handleNext = () => setStartDate(addDays(startDate, 7));

  // Helper: Check if room is booked on a specific date
  const getBookingForRoomDate = (roomId, date) => {
    return bookings.find(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      // Check collision
      return isWithinInterval(date, { start, end }) && booking.roomId === roomId;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* 1. Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-700">Room Availability Timeline</h3>
        <div className="flex gap-2">
          <button onClick={handlePrev} className="p-1.5 hover:bg-gray-100 rounded border border-gray-300">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium self-center px-2">
            {format(startDate, 'MMM d')} - {format(addDays(startDate, daysToShow - 1), 'MMM d, yyyy')}
          </span>
          <button onClick={handleNext} className="p-1.5 hover:bg-gray-100 rounded border border-gray-300">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          
          {/* Header Row (Dates) */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <div className="w-32 flex-shrink-0 p-3 font-semibold text-sm text-gray-500 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
              Room
            </div>
            {dates.map((date, index) => (
              <div 
                key={index} 
                className={`flex-1 min-w-[60px] p-2 text-center text-xs border-r border-gray-100 flex flex-col justify-center
                  ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                `}
              >
                <span className="font-bold text-gray-700">{format(date, 'EEE')}</span>
                <span className="text-gray-500">{format(date, 'd')}</span>
              </div>
            ))}
          </div>

          {/* Room Rows */}
          {rooms.map((room) => (
            <div key={room.id} className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors">
              
              {/* Room Info Column (Sticky Left) */}
              <div className="w-32 flex-shrink-0 p-3 border-r border-gray-200 bg-white sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="font-bold text-gray-800 text-sm">{room.number}</div>
                <div className="text-xs text-gray-500 truncate">{room.type}</div>
              </div>

              {/* Date Cells */}
              {dates.map((date, index) => {
                const booking = getBookingForRoomDate(room._id || room.id, date);
                const isStart = booking && isSameDay(new Date(booking.checkIn), date);
                
                // Logic to style the cell
                let cellContent = null;
                let cellClass = "";

                if (booking) {
                  // If booked
                  cellClass = "bg-blue-100 border-r border-blue-200";
                  if (isStart) {
                    cellContent = (
                      <div className="px-1 text-[10px] font-medium text-blue-800 truncate flex items-center gap-1" title={booking.guestName}>
                        <User size={10} /> {booking.guestName}
                      </div>
                    );
                  }
                } else if (room.status === 'Maintenance') {
                  // If maintenance
                  cellClass = "bg-gray-200 diagonal-stripes"; // Custom CSS class for stripes can be added
                } else {
                  // Available
                  cellClass = "hover:bg-green-50 cursor-pointer border-r border-gray-100";
                }

                return (
                  <div 
                    key={index} 
                    className={`flex-1 min-w-[60px] h-14 flex items-center justify-start overflow-hidden ${cellClass}`}
                    onClick={() => !booking && alert(`Click to book Room ${room.number} on ${format(date, 'yyyy-MM-dd')}`)}
                  >
                    {cellContent}
                  </div>
                );
              })}
            </div>
          ))}

          {rooms.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No rooms found in inventory.
            </div>
          )}

        </div>
      </div>
      
      {/* Legend Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityGrid;