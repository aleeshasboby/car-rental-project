// src/pages/user/home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Accept the 'auth' state as a property from our router
function Home({ auth }) {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
        Find Your Perfect Ride
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: '1.75', marginBottom: '2.5rem' }}>
        Premium car rentals with flexible hours, instant processing, and zero hidden fees. 
        Whether it's for business or leisure, find your drive today.
      </p>
      
      {/* Primary Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate('/cars')}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
        >
          Explore Fleet Catalog
        </button>

        {/* 2. Smart Toggle: Only show this entrance button if the user is logged OUT */}
        {auth && auth.isLoggedIn === true ? (
          <button 
            onClick={() => navigate('/bookings')}
            style={{ backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            View My Active Bookings →
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            style={{ backgroundColor: '#fff', color: '#334155', border: '1px solid #cbd5e1', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            Sign In / Create Account
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;