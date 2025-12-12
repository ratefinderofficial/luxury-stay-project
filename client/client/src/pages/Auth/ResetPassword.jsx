import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { authAPI } from '../../api/authAPI';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams(); // URL se token nikalo
  const navigate = useNavigate();
  
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await authAPI.resetPassword(token, passwords.password);
      toast.success("Password reset successful!");
      // Thora wait karke redirect karo taake user toast padh sake
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 mt-2">
          Please choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="New Password"
          type="password"
          name="password"
          icon={Lock}
          placeholder="••••••••"
          value={passwords.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          icon={Lock}
          placeholder="••••••••"
          value={passwords.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button 
          type="submit" 
          className="w-full py-3" 
          isLoading={isSubmitting}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;