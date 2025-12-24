import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft, MapPinOff } from 'lucide-react';
import Button from '../components/UI/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        
        {/* 1. Visual Icon with Animation */}
        <div className="relative mx-auto w-32 h-32 mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50"></div>
          <div className="relative w-full h-full bg-white rounded-full border-4 border-blue-50 flex items-center justify-center shadow-sm">
            <MapPinOff size={64} className="text-primary" />
          </div>
        </div>

        {/* 2. Error Message */}
        <h1 className="text-6xl font-extrabold text-gray-900 mb-2 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! It seems you've wandered into an uncharted area of our hotel. 
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* 3. Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="justify-center"
          >
            <ArrowLeft size={18} className="mr-2"/> Go Back
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            className="justify-center shadow-lg shadow-blue-200"
          >
            <Home size={18} className="mr-2"/> Return Home
          </Button>
        </div>

        {/* 4. Help Link */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-400">
          Looking for something specific? <br className="sm:hidden"/>
          <span 
            onClick={() => navigate('/contact')} 
            className="text-primary font-medium cursor-pointer hover:underline ml-1"
          >
            Contact our Concierge
          </span>
        </div>

      </div>
    </div>
  );
};

export default NotFound;