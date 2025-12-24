import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

// Hooks & Components
import useAuth from '../../hooks/useAuth';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Welcome back!');
      const role = result.user?.role?.toLowerCase(); 
      
      // Redirect Logic
      if (role === 'guest') {
        navigate('/guest/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

    } else {
      toast.error(result.message || 'Invalid email or password');
    }
    
    setIsSubmitting(false);
  };

  // --- PREMIUM STYLES ---
  const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh', // Center vertically
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '450px',
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
        color: '#1e3a8a', // Navy Blue
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
        marginBottom: '20px'
    },
    forgotPass: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#d97706', // Gold Color
        textDecoration: 'none',
        float: 'right',
        marginBottom: '5px'
    },
    loginBtn: {
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
        marginTop: '10px',
        boxShadow: '0 10px 25px rgba(30, 58, 138, 0.3)',
        transition: 'transform 0.2s'
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        margin: '30px 0',
        color: '#94a3b8',
        fontSize: '13px'
    },
    line: {
        flex: 1,
        height: '1px',
        backgroundColor: '#e2e8f0'
    },
    registerBtn: {
        display: 'block',
        width: '100%',
        padding: '12px',
        backgroundColor: 'white',
        color: '#334155',
        border: '2px solid #f1f5f9',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        textDecoration: 'none',
        transition: '0.2s',
        boxSizing: 'border-box' // Button width fix
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} className="animate-fade-in">
        
        {/* 1. Header Section */}
        <div style={styles.iconCircle}>
          <KeyRound size={32} />
        </div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>
          Sign in to manage your luxury stay.
        </p>

        {/* 2. Login Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div style={styles.formGroup}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <label style={{fontSize:'13px', fontWeight:'600', color:'#475569', marginBottom:'5px'}}>Password</label>
                <Link to="/forgot-password" style={styles.forgotPass}>Forgot password?</Link>
            </div>
            <Input
              type="password"
              name="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={styles.loginBtn}
            disabled={isSubmitting}
            onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            {isSubmitting ? "Signing in..." : <>Sign In <ArrowRight size={20} /></>}
          </button>

        </form>

        {/* 3. Divider */}
        <div style={styles.divider}>
            <div style={styles.line}></div>
            <span style={{padding:'0 10px'}}>New to LuxuryStay?</span>
            <div style={styles.line}></div>
        </div>

        {/* 4. Register Link */}
        <Link 
            to="/register" 
            style={styles.registerBtn}
            onMouseEnter={e => {e.target.style.borderColor = '#cbd5e1'; e.target.style.backgroundColor = '#f8fafc'}}
            onMouseLeave={e => {e.target.style.borderColor = '#f1f5f9'; e.target.style.backgroundColor = 'white'}}
        >
            Create Guest Account
        </Link>

      </div>
    </div>
  );
};

export default Login;