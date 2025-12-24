import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. SIDEBAR (Desktop: Fixed, Mobile: Hidden by default) */}
      {/* Note: Sidebar component ke andar 'hidden md:flex' classes hain */}
      <Sidebar />

      {/* MOBILE SIDEBAR OVERLAY (Jab mobile menu open ho) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile Sidebar Content (Reusing Sidebar logic manually for mobile width) */}
          <div className="relative flex-1 w-64 max-w-xs bg-primary h-full shadow-xl animate-in slide-in-from-left duration-200">
            {/* Humne Sidebar component ko flexible banaya tha, yahan wrap kar sakte hain */}
            {/* Lekin simplicity ke liye, hum Sidebar component ko hi mobile responsive classes dete hain.
                Is case mein, agar Sidebar component 'hidden' hai, toh hum ek clone dikha sakte hain ya CSS toggle use karein.
                Better Approach: Pass a prop to Sidebar or control visibility via CSS.
                For this code, assume Sidebar handles its own display or we mount it conditionally.
            */}
             <div className="h-full overflow-y-auto">
                <Sidebar mobile={true} onClose={() => setIsMobileMenuOpen(false)} /> 
                {/* Note: Sidebar component mein 'mobile' prop add karna padega agar styling different chahiye */}
             </div>
          </div>
        </div>
      )}

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 transition-all duration-300">
        
        {/* Top Navbar */}
        <Navbar onMobileMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 mt-16 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {/* Page Content Render Hoga Yahan */}
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
        
      </div>
    </div>
  );
};

export default DashboardLayout;