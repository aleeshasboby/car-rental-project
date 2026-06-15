// src/pages/admin/manageusers.jsx
import React, { useState } from 'react';

function ManageUsers() {
  // 1. Local state acting as our live user profiles data grid array
  const [users, setUsers] = useState([
    { id: 'USR-101', name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'user', verified: true },
    { id: 'USR-102', name: 'Priya Patel', email: 'priya@yahoo.com', role: 'user', verified: true },
    { id: 'USR-103', name: 'Amit Mishra', email: 'amit@cargo.com', role: 'admin', verified: true },
    { id: 'USR-104', name: 'Sneha Reddy', email: 'sneha@outlook.com', role: 'user', verified: false },
  ]);

  // 2. Handler to instantly toggle a user's role profile type
  const handleToggleRole = (id) => {
    setUsers(prevUsers =>
      prevUsers.map(profile => {
        if (profile.id === id) {
          const targetedRole = profile.role === 'user' ? 'admin' : 'user';
          return { ...profile, role: targetedRole };
        }
        return profile;
      })
    );
  };

  // 3. Handler to simulate account suspension/deletion
  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to suspend this user account?")) {
      setUsers(prevUsers => prevUsers.filter(profile => profile.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Heading Frame */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          User Accounts Directory
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Audit registered customer metadata, review email authorization vectors, and toggle operator permissions.
        </p>
      </div>

      {/* Main Structural Account Table Card */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: '600' }}>
              <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Full Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
              <th style={{ padding: '0.75rem 1rem' }}>KYC Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Security Role</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Management Controls</th>
            </tr>
          </thead>
          <tbody>
            {users.map((profile) => (
              <tr key={profile.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {/* ID Frame */}
                <td style={{ padding: '1rem', fontWeight: '600', color: '#64748b' }}>{profile.id}</td>
                
                {/* Name Frame */}
                <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '600' }}>{profile.name}</td>
                
                {/* Email Frame */}
                <td style={{ padding: '1rem', color: '#334155' }}>{profile.email}</td>
                
                {/* Verification/KYC Status Badge */}
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: profile.verified ? '#e0f2fe' : '#fee2e2',
                    color: profile.verified ? '#0369a1' : '#991b1b'
                  }}>
                    {profile.verified ? '✓ Verified' : '⚠️ Unverified'}
                  </span>
                </td>
                
                {/* Dynamic Role Allocation Badges */}
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: profile.role === 'admin' ? '#fee2e2' : '#f1f5f9',
                    color: profile.role === 'admin' ? '#b91c1c' : '#475569',
                    border: profile.role === 'admin' ? '1px solid #fca5a5' : '1px solid #e2e8f0'
                  }}>
                    {profile.role}
                  </span>
                </td>

                {/* Inline Interaction Buttons */}
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggleRole(profile.id)}
                    style={{ 
                      backgroundColor: '#fff', 
                      color: '#475569', 
                      border: '1px solid #cbd5e1', 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600', 
                      cursor: 'pointer', 
                      marginRight: '0.5rem' 
                    }}
                  >
                    Change to {profile.role === 'user' ? 'Admin' : 'User'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(profile.id)}
                    style={{ 
                      backgroundColor: '#fff', 
                      color: '#ef4444', 
                      border: '1px solid #fecaca', 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600', 
                      cursor: 'pointer' 
                    }}
                  >
                    Suspend Account
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

export default ManageUsers;