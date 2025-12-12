import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUTS ---
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import GuestLayout from '../layouts/GuestLayout';

// --- GUARDS ---
import ProtectedRoute from '../components/Common/ProtectedRoute';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Public/Unauthorized';

// --- PUBLIC PAGES (Jo bina login ke dikhenge) ---
import Home from '../pages/Public/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import About from '../pages/Public/About';
import Contact from '../pages/Public/Contact';
import Gallery from '../pages/Public/Gallery';
// 👇 Naam sahi kiye hain (PublicRooms aur PublicRoomDetails)
import PublicRooms from '../pages/Public/Rooms'; 
import PublicRoomDetails from '../pages/Public/RoomDetails'; 


// --- GUEST PORTAL PAGES (Jo Login ke baad dikhenge) ---
import GuestDashboard from '../pages/Guest/GuestDashboard';
import AllRooms from '../pages/Guest/AllRooms';       
import RoomDetails from '../pages/Guest/RoomDetails'; 
import GuestBooking from '../pages/Guest/GuestBooking';
import MyBookings from '../pages/Guest/MyBookings';
import ProfileSettings from '../pages/Guest/ProfileSettings';
import GuestServices from '../pages/Guest/GuestServices'; 
import GuestFeedback from '../pages/Feedback/AddFeedback'; 

// --- ADMIN / STAFF PAGES ---
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import StaffDashboard from '../pages/Dashboard/StaffDashboard';
import GuestList from '../pages/Guest/GuestList'; // Path check kar lena (Guests vs Guest folder)

import RoomList from '../pages/Rooms/RoomList';
import AddRoom from '../pages/Rooms/AddRoom';
import RoomStatus from '../pages/Rooms/RoomStatus';

import BookingList from '../pages/Booking/BookingList';
// import CreateBooking from '../pages/Booking/CreateBooking'; // Agar admin ka alag form hai

import InvoiceList from '../pages/Billing/InvoiceList';
import GenerateBill from '../pages/Billing/GenerateBill';

import TasksList from '../pages/Housekeeping/TasksList';
import Schedule from '../pages/Housekeeping/Schedule';

import MaintenanceRequests from '../pages/Maintenance/MaintenanceRequests';
import LogIssue from '../pages/Maintenance/LogIssue';

import FeedbackList from '../pages/Feedback/Feedback'; // Admin View

import AnalyticsDashboard from '../pages/Reports/AnalyticsDashboard';
import SystemConfig from '../pages/Settings/SystemConfig';

// --- ROLES CONFIG ---
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  RECEPTION: 'receptionist',
  HOUSEKEEPING: 'housekeeping',
  MAINTENANCE: 'maintenance',
  GUEST: 'guest'
};

const STAFF_ROLES = [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTION, ROLES.HOUSEKEEPING, ROLES.MAINTENANCE];
const ADMIN_ROLES = [ROLES.ADMIN, ROLES.MANAGER];

const AppRoutes = () => {
  return (
    <Routes>
      
      {/* 1. PUBLIC ROUTES (Accessible by everyone) */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
      
      {/* Public Room Viewing */}
      <Route path="/rooms" element={<PublicRooms />} />
      <Route path="/rooms/:id" element={<PublicRoomDetails />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🟢 2. GUEST PORTAL (Customer Side) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.GUEST]} />}>
        <Route element={<GuestLayout />}>
            
            <Route path="/guest/dashboard" element={<GuestDashboard />} />
            <Route path="/guest/services" element={<GuestServices />} />

            {/* 👇 Guest URLs ko '/guest/' se shuru kiya taake conflict na ho */}
            <Route path="/guest/rooms" element={<AllRooms />} />  
            <Route path="/guest/rooms/:id" element={<RoomDetails />} /> 
            <Route path="/guest/book" element={<GuestBooking />} /> 

            {/* User Data */}
            <Route path="/guest/bookings" element={<MyBookings />} />
            <Route path="/guest/profile" element={<ProfileSettings />} />
            <Route path="/guest/feedback" element={<GuestFeedback />} />
        </Route>
      </Route>

      {/* 🔴 3. ADMIN & STAFF PANEL (Management Side) */}
      <Route element={<ProtectedRoute allowedRoles={STAFF_ROLES} />}>
        <Route element={<DashboardLayout />}>
          
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />

          {/* Guest Management */}
          <Route path="/guests" element={<GuestList />} />

          {/* Room Management (Admin) */}
          <Route path="/admin/rooms" element={<RoomList />} /> 
          <Route path="/rooms/status" element={<RoomStatus />} />
          
          <Route element={<ProtectedRoute allowedRoles={ADMIN_ROLES} />}>
            <Route path="/rooms/add" element={<AddRoom />} />
            <Route path="/rooms/edit/:id" element={<AddRoom />} />
          </Route>

          {/* Bookings */}
          <Route path="/bookings" element={<BookingList />} />
          {/* Admin Walk-in Booking (Filhal GuestBooking use kar rahe ho, baad mein change kar sakte ho) */}
          <Route path="/bookings/new" element={<GuestBooking />} /> 

          {/* Billing */}
          <Route path="/billing" element={<InvoiceList />} />
          <Route path="/billing/generate" element={<GenerateBill />} />
          <Route path="/billing/view/:id" element={<GenerateBill />} /> {/* View Bill */}

          {/* Housekeeping */}
          <Route path="/housekeeping" element={<TasksList />} />
          <Route element={<ProtectedRoute allowedRoles={[...ADMIN_ROLES, ROLES.HOUSEKEEPING]} />}>
            <Route path="/housekeeping/schedule" element={<Schedule />} />
          </Route>

          {/* Maintenance */}
          <Route path="/maintenance" element={<MaintenanceRequests />} />
          <Route path="/maintenance/log" element={<LogIssue />} />

          {/* Feedback (Admin View) */}
          <Route path="/feedback" element={<FeedbackList />} />

          {/* Reports & Settings (Admin Only) */}
          <Route element={<ProtectedRoute allowedRoles={ADMIN_ROLES} />}>
            <Route path="/reports" element={<AnalyticsDashboard />} />
            <Route path="/settings" element={<SystemConfig />} />
          </Route>

        </Route>
      </Route>

      {/* ERRORS & UNAUTHORIZED */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
};

export default AppRoutes;