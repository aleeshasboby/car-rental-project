// src/components/layout/navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // 1. Check if a user session token is actively saved in the browser storage
  const isAuthenticated = !!sessionStorage.getItem('token');

  // Safely grab user email if stored during login, otherwise fallback to generic label
  const userEmail = sessionStorage.getItem('email') || "User Account";

  // Handle a clean session destruction on logout
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    alert("Logged out successfully! 👋");
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Brand App Logo link pointing to Home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none', color: '#1e293b' }}>
            🚗 CarGo
          </Link>
          
          {/* Main User Navigation Links */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
              Home
            </Link>
            
            <Link to="/cars" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
              Browse Cars
            </Link>
            
            {/* 🔒 THE SECURITY GATE: "My Rentals" only renders if the user is verified/authenticated */}
            {isAuthenticated && (
              <Link to="/bookings" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '600', backgroundColor: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                My Rentals
              </Link>
            )}
            
            {/* Quick link to test the admin side if needed */}
            <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#dc2626', fontSize: '0.9rem', fontWeight: '600' }}>
              Admin Panel
            </Link>
          </div>
        </div>

        {/* User Context Actions Frame */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
          {isAuthenticated ? (
            // Shown ONLY if logged in 🟢
            <>
              <span style={{ color: '#1e293b', backgroundColor: '#eff6ff', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #bfdbfe', fontWeight: '500' }}>
                👤 {userEmail}
              </span>
              <button 
                onClick={handleLogout} 
                style={{ backgroundColor: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#fff' }}
              >
                Logout
              </button>
            </>
          ) : (
            // Shown ONLY if logged out 🔴
            <button 
              onClick={() => navigate('/login')} 
              style={{ backgroundColor: '#2563eb', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#fff' }}
            >
              Login / Sign Up
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;