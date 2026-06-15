// src/pages/auth/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// We explicitly pull setAuth from the component props here
function Login({ setAuth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit triggered for email:", email); // Helpful debug log

    // Absolute fallback check to ensure setAuth exists before calling it
    if (!setAuth) {
      console.error("Critical Error: setAuth function was not passed down correctly from App.jsx!");
      alert("Application state error. Check your App.jsx configuration.");
      return;
    }

    // Role verification engine
    if (email.toLowerCase().includes('admin')) {
      console.log("Admin signature detected. Routing to admin dashboard...");
      setAuth({
        isLoggedIn: true,
        email: email,
        role: 'admin'
      });
      navigate('/admin/dashboard');
    } else {
      console.log("Standard user signature detected. Routing to customer portal...");
      setAuth({
        isLoggedIn: true,
        email: email,
        role: 'user'
      });
      navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', padding: '2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Sign in to CarGo</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Use <strong style={{ color: '#ef4444' }}>admin@cargo.com</strong> to unlock the admin dashboard tracks.
          </p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }} 
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              Sign In
            </button>
          </form>
          
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '1.5rem', marginBottom: '0' }}>
            Don't have an account? <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;