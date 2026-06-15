// src/components/layout/navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Temporary mock role for testing routing states
  const userRole = "user"; 

  return (
    <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Brand App Logo link pointing to Home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none', color: '#1e293b' }}>
            🚗 CarGo
          </Link>
          
          {/* Main User Navigation Links */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
              Home
            </Link>
            <Link to="/cars" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
              Browse Cars
            </Link>
            <Link to="/bookings" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
              My Rentals
            </Link>
            
            {/* Quick link to test the admin side if needed */}
            <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#dc2626', fontSize: '0.9rem', fontWeight: '600' }}>
              Admin Panel
            </Link>
          </div>
        </div>

        {/* User Context Actions Frame */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
          <span style={{ color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
            Role: <strong>{userRole}</strong>
          </span>
          <button 
            onClick={() => navigate('/login')} 
            style={{ backgroundColor: '#f1f5f9', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', color: '#334155' }}
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;