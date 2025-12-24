import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../../components/UI/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={48} className="text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          Sorry, you do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="mr-2"/> Go Back
          </Button>
          <Button onClick={() => navigate('/login')}>
            Login with Different Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;