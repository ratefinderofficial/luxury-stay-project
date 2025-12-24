import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/UI/Input';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsSubmitting(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'guest' 
    });

    if (result.success) {
      toast.success('Account Created! Please Login.');
      
      // 🟢 CHANGE: Ab dashboard nahi, Login page par bhej rahe hain
      navigate('/login'); 
      
    } else {
      toast.error(result.message);
    }
    
    setIsSubmitting(false);
  };

  // --- PREMIUM STYLES ---
  const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '20px 0'
    },
    card: {
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '500px',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f1f5f9',
        textAlign: 'center'
    },
    iconCircle: {
        width: '70px',
        height: '70px',
        backgroundColor: '#eff6ff',
        color: '#1e3a8a',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto',
        boxShadow: '0 10px 20px rgba(30, 58, 138, 0.1)'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: '8px'
    },
    subtitle: {
        color: '#64748b',
        fontSize: '15px',
        marginBottom: '30px'
    },
    formGroup: {
        textAlign: 'left',
        marginBottom: '15px'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
    },
    submitBtn: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
        boxShadow: '0 10px 25px rgba(30, 58, 138, 0.3)',
        transition: 'transform 0.2s'
    },
    loginLink: {
        marginTop: '25px',
        fontSize: '14px',
        color: '#64748b'
    },
    linkText: {
        color: '#2563eb',
        fontWeight: '700',
        textDecoration: 'none',
        marginLeft: '5px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} className="animate-fade-in">
        
        {/* Header */}
        <div style={styles.iconCircle}>
          <UserPlus size={32} />
        </div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join LuxuryStay for a premium experience.</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          <div style={styles.formGroup}>
            <Input label="Full Name" name="name" icon={User} placeholder="Ali Khan" value={formData.name} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <Input label="Email Address" name="email" type="email" icon={Mail} placeholder="ali@example.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <Input label="Phone Number" name="phone" icon={Phone} placeholder="+92 300..." value={formData.phone} onChange={handleChange} required />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
                <Input label="Password" name="password" type="password" icon={Lock} placeholder="••••••" value={formData.password} onChange={handleChange} required />
            </div>
            <div style={styles.formGroup}>
                <Input label="Confirm" name="confirmPassword" type="password" icon={Lock} placeholder="••••••" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          
          <button 
            type="submit" 
            style={styles.submitBtn} 
            disabled={isSubmitting}
            onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            {isSubmitting ? "Creating Account..." : <>Register Now <ArrowRight size={20}/></>}
          </button>

        </form>

        {/* Footer */}
        <div style={styles.loginLink}>
          Already have an account? 
          <Link to="/login" style={styles.linkText}>Sign In</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;