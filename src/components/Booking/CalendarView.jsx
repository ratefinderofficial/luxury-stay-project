import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarView = ({ bookings = [], onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calendar Grid Generation Logic
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-4 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <CalendarIcon size={20} />
          </div>
          <span className="text-xl font-bold text-gray-800">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="text-sm font-medium text-primary hover:underline"
          >
            Today
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 border-b border-gray-200">
        {days.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    // Generate all dates visible on the grid
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    // Loop through days
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 bg-gray-200 gap-px border border-gray-200">
        {dateRange.map((dayItem, idx) => {
          // Check if this day has any bookings
          const dayBookings = bookings.filter(b => 
            isSameDay(new Date(b.checkIn), dayItem) || 
            (new Date(b.checkIn) <= dayItem && new Date(b.checkOut) >= dayItem)
          );

          const isCurrentMonth = isSameMonth(dayItem, monthStart);
          
          return (
            <div
              key={dayItem.toString()}
              className={`min-h-[100px] bg-white p-2 relative group cursor-pointer transition-colors hover:bg-blue-50
                ${!isCurrentMonth ? 'text-gray-300 bg-gray-50' : 'text-gray-700'}
                ${isToday(dayItem) ? 'bg-blue-50/50' : ''}
              `}
              onClick={() => onDateSelect && onDateSelect(dayItem)}
            >
              {/* Date Number */}
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full
                  ${isToday(dayItem) ? 'bg-primary text-white shadow-md' : ''}
                `}>
                  {format(dayItem, dateFormat)}
                </span>
              </div>

              {/* Booking Indicators (Dots/Bars) */}
              <div className="mt-2 space-y-1 overflow-hidden max-h-[60px]">
                {dayBookings.slice(0, 3).map((booking, i) => (
                  <div 
                    key={i} 
                    className="text-[10px] truncate px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 font-medium"
                    title={`${booking.guestName} - Room ${booking.roomNumber}`}
                  >
                    {booking.guestName}
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <div className="text-[10px] text-gray-500 pl-1">
                    + {dayBookings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CalendarView;