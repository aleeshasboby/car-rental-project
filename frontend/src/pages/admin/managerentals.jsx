// src/pages/admin/managerentals.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed, or replace with your standard api client utility

function ManageRentals() {
  // 🟢 FIXED: Replaced hardcoded dummy data array with an empty state waiting for the database
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. FETCH LIVE BOOKINGS FROM DATABASE
  const fetchAllRentals = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      
      // Requesting the complete global ledger list across all platform users
      const response = await axios.get('http://localhost:5000/api/admin/bookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setRentals(response.data);
    } catch (err) {
      console.error("Failed to query global records backend:", err);
      setError("Could not retrieve administrative rental logs from the database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRentals();
  }, []);

  // 2. LIVE DATA PERSISTENCE: Send the updated status directly to MongoDB
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = sessionStorage.getItem('token');
      
      // Fires an update route back to your backend engine controller
      await axios.patch(`http://localhost:5000/api/admin/bookings/${id}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Optimistically update local layout UI state on successful server resolution
      setRentals(prevRentals => 
        prevRentals.map(item => 
          (item._id || item.id) === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Failed to persist updated validation status:", err);
      alert("Error: Could not sync status modification to the backend database server.");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>
        <h3>Connecting to Live Global Ledger Vault... 📡</h3>
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
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          Global Rental Ledgers
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Monitor real-time platform bookings, check incoming transactions, and update reservation fulfillment statuses.
        </p>
      </div>

      {/* Main Table Wrapper Box */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)', overflowX: 'auto' }}>
        {rentals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
            <p style={{ margin: 0 }}>No dynamic customer rentals have been generated inside the database yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: '600' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Booking ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Customer Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Vehicle</th>
                <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Cost</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status Badge</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((item) => {
                const bookingId = item._id || item.id;
                return (
                  <tr key={bookingId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* ID Column */}
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>
                      {bookingId.substring(0, 8).toUpperCase()}
                    </td>
                    
                    {/* Customer Identity Field (Using safe fallback values from user schema join) */}
                    <td style={{ padding: '1rem', color: '#334155', fontWeight: '500' }}>
                      {item.user?.email || item.customerEmail || item.email || 'Registered Customer'}
                    </td>
                    
                    {/* Vehicle Details */}
                    <td style={{ padding: '1rem', color: '#475569' }}>
                      {item.car?.name || item.carName || 'Asset Profile'}
                    </td>
                    
                    {/* Duration Display */}
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      {item.duration || `${item.totalDays || 1} Days`}
                    </td>
                    
                    {/* Amount formatted cleanly */}
                    <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a' }}>
                      ₹{(item.totalPrice || item.totalAmount || item.amount || 0).toLocaleString('en-IN')}
                    </td>
                    
                    {/* Dynamic Status Badges */}
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '6px',
                        backgroundColor: item.status === 'Confirmed' || item.status === 'Approved' ? '#dcfce7' : item.status === 'Pending Approval' || item.status === 'Pending' ? '#fef9c3' : '#f1f5f9',
                        color: item.status === 'Confirmed' || item.status === 'Approved' ? '#166534' : item.status === 'Pending Approval' || item.status === 'Pending' ? '#a16207' : '#475569'
                      }}>
                        {item.status}
                      </span>
                    </td>

                    {/* Interactive Action Buttons */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {(item.status === 'Pending Approval' || item.status === 'Pending') && (
                        <button 
                          onClick={() => handleUpdateStatus(bookingId, 'Confirmed')}
                          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginRight: '0.5rem' }}
                        >
                          Approve Ride
                        </button>
                      )}
                      {(item.status === 'Confirmed' || item.status === 'Approved') && (
                        <button 
                          onClick={() => handleUpdateStatus(bookingId, 'Completed')}
                          style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginRight: '0.5rem' }}
                        >
                          Mark Completed
                        </button>
                      )}
                      {item.status !== 'Cancelled' && item.status !== 'Completed' && (
                        <button 
                          onClick={() => handleUpdateStatus(bookingId, 'Cancelled')}
                          style={{ backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fecaca', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default ManageRentals;