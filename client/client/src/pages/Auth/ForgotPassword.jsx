import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../api/authAPI'; // Direct API call here since no user session
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await authAPI.forgotPassword(email);
      setEmailSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsSubmitting(false);
    }
  };

  // View after sending email
  if (emailSent) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Mail size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 mb-8">
          We have sent a password reset link to <br/> <span className="font-medium text-gray-800">{email}</span>
        </p>
        <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={() => setEmailSent(false)}>
                Try another email
            </Button>
            <Link to="/login" className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-800">
             <ArrowLeft size={16} className="mr-2" /> Back to Login
            </Link>
        </div>
      </div>
    );
  }

  // Initial Form View
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-500 mt-2">
          Don't worry! It happens. Please enter the email associated with your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button 
          type="submit" 
          className="w-full py-3" 
          isLoading={isSubmitting}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;