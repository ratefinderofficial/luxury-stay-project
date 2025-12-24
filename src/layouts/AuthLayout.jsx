import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-white">
      
      {/* ==============================
          LEFT SIDE: BRANDING AREA
          (Hidden on Mobile, Visible on Desktop)
      =============================== */}
      <div className="hidden md:flex w-1/2 relative bg-blue-900 items-center justify-center overflow-hidden">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.6, // Thoda dark kiya taake text parha jaye
            filter: 'brightness(0.7)'
          }}
        ></div>
        
        {/* Content Over Image */}
        <div className="relative z-10 p-12 max-w-lg text-center text-white">
          
          {/* Icon */}
          <div className="mb-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl inline-block border border-white/20 shadow-lg">
            <ShieldCheck size={48} className="text-yellow-400" />
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl font-bold mb-6 tracking-tight drop-shadow-md">
            LuxuryStay
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-blue-100 font-light leading-relaxed mb-8">
            "Experience the art of hospitality. Streamline operations, enhance guest satisfaction, and manage your property with elegance."
          </p>
          
          {/* Footer Link */}
          <div className="flex items-center justify-center gap-4 text-sm text-blue-200 mt-8 pt-8 border-t border-white/20">
            <span>&copy; {new Date().getFullYear()} LuxuryStay</span>
            <span>•</span>
            <Link to="/" className="hover:text-white hover:underline transition-colors">
              Back to Website
            </Link>
          </div>
        </div>
      </div>

      {/* ==============================
          RIGHT SIDE: FORM AREA
          (Where Login/Register will load)
      =============================== */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-white">
        
        <div className="w-full max-w-md">
          
          {/* Mobile Logo (Sirf Mobile par dikhega) */}
          <div className="md:hidden text-center mb-10">
             <div className="inline-flex items-center gap-2 justify-center mb-2">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold">LS</div>
                <h2 className="text-2xl font-bold text-blue-900">LuxuryStay</h2>
             </div>
             <p className="text-gray-500 text-sm">Staff Portal Access</p>
          </div>

          {/* DYNAMIC CONTENT (Login.jsx yahan load hoga) */}
          <Outlet />
          
          {/* Legal Footer */}
          <div className="mt-12 text-center text-xs text-gray-400">
            <p>Protected by reCAPTCHA and subject to the Privacy Policy.</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AuthLayout;