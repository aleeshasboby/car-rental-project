// frontend/src/pages/user/terms.jsx
import React from 'react';

function Terms() {
  return (
    <div style={{ minHeight: '80vh', padding: '4rem 2rem', backgroundColor: '#1A1A1C', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#1A1A1C', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #2D3748' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#E2E8F0', margin: '0 0 1.5rem 0' }}>Terms of Service</h2>
        <p style={{ color: '#A3A3A3', fontSize: '0.95rem', lineHeight: '1.6' }}>Welcome to CarRental Co. Please read our rules carefully.</p>
        <hr style={{ border: 0, borderTop: '1px solid #2D3748', margin: '1.5rem 0' }} />
        
        <h4 style={{ color: '#0f172a', margin: '1.5rem 0 0.5rem 0' }}>1. Rental Eligibility</h4>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>Users must possess a valid driver's license matching Indian regional transportation rules and pass security verification protocols upon vehicle pickup.</p>
        
        <h4 style={{ color: '#0f172a', margin: '1.5rem 0 0.5rem 0' }}>2. Geofencing & Hub Boundaries</h4>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>Vehicles are tied to specific geographical station hubs. Unauthorized drop-offs outside the chosen perimeter or allocated garage coordinate targets may incur logistical recovery processing fees.</p>
      </div>
    </div>
  );
}

export default Terms;