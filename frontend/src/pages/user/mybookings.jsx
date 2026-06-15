// src/pages/user/mybookings.jsx
import React, { useState } from 'react';

function MyBookings() {
  // 1. Mock database state representing this specific customer's active and past rental contracts
  const [myRides, setMyRides] = useState([
    { id: 'BR-9081', car: 'Mahindra Thar', date: 'June 18, 2026', duration: '3 Days', totalAmount: 13500, status: 'Pending Approval' },
    { id: 'BR-7240', car: 'Honda Civic', date: 'May 02, 2026', duration: '2 Days', totalAmount: 3200, status: 'Completed' }
  ]);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Dynamic Welcome Headers */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          My Bookings Ledger
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Track active trip status, check approval vectors, and download historical digital invoices.
        </p>
      </div>

      {/* Grid Stack Loop displaying individual reservation tickets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {myRides.map((ride) => (
          <div 
            key={ride.id} 
            style={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)'
            }}
          >
            {/* Left Frame: Trip Details */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '10px' }}>
                🚗
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Booking ID: {ride.id}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: '0.15rem 0 0.4rem 0' }}>
                  {ride.car}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>📅 <strong>Start Date:</strong> {ride.date}</span>
                  <span>⏱️ <strong>Duration:</strong> {ride.duration}</span>
                </div>
              </div>
            </div>

            {/* Right Frame: Cost Breakdown & Functional Action Badges */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', block: 'block' }}>Total Paid</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '-0.15rem' }}>
                  ₹{ride.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
              
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                padding: '0.3rem 0.6rem', 
                borderRadius: '6px',
                display: 'inline-block',
                backgroundColor: ride.status === 'Completed' ? '#dcfce7' : '#fef9c3',
                color: ride.status === 'Completed' ? '#15803d' : '#a16207'
              }}>
                ● {ride.status}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default MyBookings;