// src/pages/user/mybookings.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api.js'; // 🟢 FIXED: Switched from direct axios to your pre-configured api client wrapper

function MyBookings({ auth }) {
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalBookings = async () => {
      try {
        setLoading(true);
        
        // 1. Resolve current user identity vectors safely
        const userEmail = auth?.email || JSON.parse(sessionStorage.getItem('user'))?.email || localStorage.getItem('userEmail');

        if (!userEmail) {
          setError("Session identity missing. Please re-authenticate.");
          return;
        }

        // 2. Query your live backend endpoint passing identity parameters via dynamic route path
        // 🟢 FIXED: Points cleanly to /bookings/your-email matching backend route: router.get('/:email')
        const response = await api.get(`/bookings/${userEmail}`);

        // 3. Populate state container with filtered response data array
        setMyRides(response.data);
      } catch (err) {
        console.error("Database tracking link failure:", err);
        setError("Could not extract individual booking ledgers from server uplink.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalBookings();
  }, [auth]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>
        <h3>Loading your secure rental ledger... ⏳</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#ef4444' }}>
        <p style={{ fontWeight: 'bold' }}>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Dynamic Welcome Headers */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          My Bookings Ledger
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Track active trip status, check approval vectors, and view personal historical digital invoices.
        </p>
      </div>

      {/* Grid Stack Loop displaying individual reservation tickets */}
      {myRides.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>No Active Reservations Found</h4>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>You haven't placed any vehicle bookings on this account statement profile yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {myRides.map((ride) => (
            <div 
              key={ride._id || ride.id} 
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
                  {ride.car?.type === 'SUV' ? '🚙' : '🚗'}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Booking ID: {(ride._id || ride.id).substring(0, 8).toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: '0.15rem 0 0.4rem 0' }}>
                    {ride.car?.name || 'Asset Profile'}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                    {/* 🟢 FIXED: Real Date Span Range formatting */}
                    <span>📅 <strong>Dates:</strong> {new Date(ride.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(ride.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    
                    {/* 🟢 FIXED: Live math day calculations matching admin ledger tracking */}
                    <span>⏱️ <strong>Duration:</strong> {(() => {
                      const start = new Date(ride.startDate);
                      const end = new Date(ride.endDate);
                      const diffTime = Math.abs(end - start);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return `${diffDays || 1} ${diffDays === 1 ? 'Day' : 'Days'}`;
                    })()}</span>
                  </div>
                </div>
              </div>

              {/* Right Frame: Cost Breakdown & Functional Action Badges */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Due</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '-0.15rem' }}>
                    ₹{(ride.totalPrice || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '6px',
                  display: 'inline-block',
                  backgroundColor: ride.status === 'Confirmed' || ride.status === 'Approved' || ride.status === 'Completed' ? '#dcfce7' : '#fef9c3',
                  color: ride.status === 'Confirmed' || ride.status === 'Approved' || ride.status === 'Completed' ? '#15803d' : '#a16207'
                }}>
                  ● {ride.status || 'Pending'}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default MyBookings;