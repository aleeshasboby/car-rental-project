// src/pages/admin/managerentals.jsx
import React, { useState } from 'react';

function ManageRentals() {
  // 1. Local state acting as our live active bookings ledger database
  const [rentals, setRentals] = useState([
    { id: 'BR-9081', customer: 'Rahul Sharma', car: 'Mahindra Thar', duration: '3 Days', amount: 13500, status: 'Pending Approval' },
    { id: 'BR-8842', customer: 'Priya Patel', car: 'Tata Nexon EV', duration: '5 Days', amount: 10000, status: 'Confirmed' },
    { id: 'BR-8711', customer: 'Amit Mishra', car: 'Hyundai Creta', duration: '1 Day', amount: 2500, status: 'Completed' },
  ]);

  // 2. Handler to instantly update a booking's status
  const handleUpdateStatus = (id, newStatus) => {
    setRentals(prevRentals => 
      prevRentals.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          Global Rental Ledgers
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Monitor platform bookings, check incoming transactions, and update reservation fulfillment statuses.
        </p>
      </div>

      {/* Main Table Wrapper Box */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: '600' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Booking ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Customer Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Vehicle</th>
              <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
              <th style={{ padding: '0.75rem 1rem' }}>Total Cost</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status Badge</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {/* ID Column */}
                <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>{item.id}</td>
                
                {/* Customer Column */}
                <td style={{ padding: '1rem', color: '#334155', fontWeight: '500' }}>{item.customer}</td>
                
                {/* Vehicle Column */}
                <td style={{ padding: '1rem', color: '#475569' }}>{item.car}</td>
                
                {/* Duration Column */}
                <td style={{ padding: '1rem', color: '#64748b' }}>{item.duration}</td>
                
                {/* Amount Column formatted natively in INR */}
                <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a' }}>
                  ₹{item.amount.toLocaleString('en-IN')}
                </td>
                
                {/* Dynamic Status Badges */}
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '6px',
                    backgroundColor: item.status === 'Confirmed' ? '#dcfce7' : item.status === 'Pending Approval' ? '#fef9c3' : '#f1f5f9',
                    color: item.status === 'Confirmed' ? '#166534' : item.status === 'Pending Approval' ? '#a16207' : '#475569'
                  }}>
                    {item.status}
                  </span>
                </td>

                {/* Interactive Action Buttons */}
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {item.status === 'Pending Approval' && (
                    <button 
                      onClick={() => handleUpdateStatus(item.id, 'Confirmed')}
                      style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginRight: '0.5rem' }}
                    >
                      Approve Ride
                    </button>
                  )}
                  {item.status === 'Confirmed' && (
                    <button 
                      onClick={() => handleUpdateStatus(item.id, 'Completed')}
                      style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginRight: '0.5rem' }}
                    >
                      Mark Completed
                    </button>
                  )}
                  <button 
                    onClick={() => handleUpdateStatus(item.id, 'Cancelled')}
                    style={{ backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fecaca', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ManageRentals;