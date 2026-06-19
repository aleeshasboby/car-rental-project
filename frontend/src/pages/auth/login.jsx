// src/pages/auth/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 🟢 Added useLocation
import { loginUser } from '../../services/authservice.js';

function Login({ setAuth }) {
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 Read current state data passed from navigation gates
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!setAuth) {
      console.error("Critical Error: setAuth function was not passed down correctly from App.jsx!");
      alert("Application state error. Check your App.jsx configuration.");
      return;
    }

    try {
      const data = await loginUser(email, password);

      setAuth({
        isLoggedIn: true,
        email: data.user.email,
        role: data.user.role
      });

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // 🟢 DYNAMIC REDIRECT GATEWAY:
        // Check if there's a memory destination saved. If not, fallback to the homepage ('/').
        const destination = location.state?.redirectTo || '/';
        navigate(destination);
      }
    } catch (err) {
      console.error("Login failure:", err);
      setError(err.response?.data?.message || "Invalid credentials or server connection lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', padding: '2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Sign in to CarGo</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Enter your email and password to log into your account.
          </p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.25rem', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
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
                disabled={loading}
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', backgroundColor: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
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