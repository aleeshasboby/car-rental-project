// frontend/src/pages/admin/manageusers.jsx
import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole } from '../../services/userservice.js';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all registered users when page loads
  useEffect(() => {
    fetchUsersList();
  }, []);

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to sync users database catalog.');
    } finally {
      setLoading(false);
    }
  };

  // Handle promoting or demoting an account rank
  const handleRoleToggle = async (userId, currentRole) => {
    const targetRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmChange = window.confirm(`Are you sure you want to change this user's privilege access level to "${targetRole.toUpperCase()}"?`);
    
    if (!confirmChange) return;

    try {
      await updateUserRole(userId, targetRole);
      alert('User privileges updated successfully! 🎉');
      // Refresh list to instantly show visual update
      fetchUsersList();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to apply security clearance update.');
    }
  };

  // Filter users array based on search search input (Name or Email matches)
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>🛡️ Administrative Command Center</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>View registered user accounts and modify system access clearance privileges.</p>
        </div>
      </div>

      {/* Search Input Bar Field */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="🔍 Search users by name or email address..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontSize: '0.95rem' }}
        />
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '8px', fontWeight: '600', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontWeight: '600' }}>
          Querying secure user matrices...
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>USER IDENTIFIER</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>EMAIL ADDRESS</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>CLEARANCE LEVEL</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem', textAlign: 'right' }}>SECURITY ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No matching user accounts discovered inside this database sector.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>{user.name}</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        backgroundColor: user.role === 'admin' ? '#fef3c7' : '#e0f2fe',
                        color: user.role === 'admin' ? '#d97706' : '#0369a1'
                      }}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRoleToggle(user._id, user.role)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          border: '1px solid',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          backgroundColor: user.role === 'admin' ? '#fff' : '#4f46e5',
                          borderColor: user.role === 'admin' ? '#dc2626' : '#4f46e5',
                          color: user.role === 'admin' ? '#dc2626' : '#fff'
                        }}
                      >
                        {user.role === 'admin' ? 'Demote Access' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;