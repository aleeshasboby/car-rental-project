// src/pages/admin/dashboard.jsx
import React from 'react';

function Dashboard() {
  // Mock metrics acting as system aggregation counts
  const metrics = [
    { title: 'Total Revenue Generated', value: '₹48,500', icon: '📈', color: '#e0f2fe', textColor: '#0369a1' },
    { title: 'Active Fleet Vehicles', value: '24 Cars', icon: '🚗', color: '#dcfce7', textColor: '#15803d' },
    { title: 'Pending Car Bookings', value: '7 Rides', icon: '⏳', color: '#fef9c3', textColor: '#a16207' },
    { title: 'Registered Operators', value: '142 Users', icon: '👥', color: '#f3e8ff', textColor: '#6b21a8' },
  ];

  // Mock array simulating real-time platform system updates
  const recentActivities = [
    { id: 1, text: 'New user Rahul Sharma registered an account', time: '5 mins ago', tag: 'USER' },
    { id: 2, text: 'Booking #1042 confirmed for Mahindra Thar (₹4,500)', time: '22 mins ago', tag: 'BOOKING' },
    { id: 3, text: 'Admin updated inventory rates for Tata Nexon EV', time: '1 hour ago', tag: 'FLEET' },
    { id: 4, text: 'Payment received via UPI from Priya Patel', time: '2 hours ago', tag: 'REVENUE' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Welcome Header Anchor */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          Administrative Overview Control Panel
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Real-time diagnostics tracking system registrations, fleet utility overheads, and rental volumes.
        </p>
      </div>

      {/* Grid Block: Key Performance Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {metrics.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              backgroundColor: '#fff', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)'
            }}
          >
            <div style={{ backgroundColor: item.color, fontSize: '1.5rem', padding: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginTop: '0.15rem' }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Layer: Operations Activity Feed Log */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           Live System Activity Stream
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentActivities.map((log) => (
            <div 
              key={log.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingBottom: '1rem', 
                borderBottom: '1px solid #f1f5f9' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px',
                  backgroundColor: log.tag === 'REVENUE' ? '#dcfce7' : log.tag === 'BOOKING' ? '#e0f2fe' : '#f1f5f9',
                  color: log.tag === 'REVENUE' ? '#166534' : log.tag === 'BOOKING' ? '#0369a1' : '#475569'
                }}>
                  {log.tag}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '500' }}>
                  {log.text}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;