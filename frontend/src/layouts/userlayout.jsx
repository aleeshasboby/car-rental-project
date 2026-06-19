// src/layouts/userlayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authservice.js';

function UserLayout({ auth, onLogout }) {
  const navigate = useNavigate();
  
  // DYNAMIC STATE FALLBACK 🔄
  // If parent prop 'auth' isn't set, read directly from localStorage tokens
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (auth && auth.isLoggedIn) {
      setCurrentUser(auth);
    } else {
      // 🟢 Read from sessionStorage instead
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser({
          isLoggedIn: true,
          email: parsed.email,
          role: parsed.role
        });
      } else {
        setCurrentUser(null);
      }
    }
  }, [auth]); // Recalculate whenever the top-level auth prop updates

  // Dynamic logout handler that respects both configurations
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout(); // Triggers your top level App.jsx logout state cleaner
    } else {
      logoutUser(); // Fallback directly to clearing localStorage
      setCurrentUser(null);
    }
    navigate('/login');
  };

  // Quick debug safety: logs state to console so you can audit live changes
  console.log("Current UserLayout Dynamic Auth State:", currentUser);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Global Customer Navigation Hub */}
      <header style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        
        {/* Left Side: Logo Branding Anchor */}
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🚗 CarGo
        </Link>

        {/* Center: Global Navigation Links */}
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Home</Link>
          <Link to="/cars" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Browse Cars</Link>
          <Link to="/bookings" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>My Bookings</Link>
        </nav>

        {/* Right Side: Strict Authorization State Component Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentUser && currentUser.isLoggedIn === true ? (
            
            // SECURITY TRACK A: User session is active -> Show operational identity & logout trigger
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ 
                fontSize: '0.85rem', 
                color: '#334155', 
                fontWeight: '600', 
                backgroundColor: '#f1f5f9', 
                padding: '0.5rem 0.9rem', 
                borderRadius: '20px',
                border: '1px solid #e2e8f0'
              }}>
                👤 {currentUser.email || 'Active User'}
              </span>
              <button 
                onClick={handleLogoutClick}
                style={{ 
                  backgroundColor: '#ef4444', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '0.5rem 1.1rem', 
                  borderRadius: '6px', 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Logout
              </button>
            </div>

          ) : (
            
            // SECURITY TRACK B: Guest session -> Show entrance access gates
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => navigate('/login')}
                style={{ 
                  backgroundColor: 'transparent', 
                  color: '#475569', 
                  border: '1px solid #cbd5e1', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '6px', 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')}
                style={{ 
                  backgroundColor: '#2563eb', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '6px', 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                Create Account
              </button>
            </div>

          )}
        </div>

      </header>

      {/* Main Framework Target Canvas */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}

export default UserLayout;