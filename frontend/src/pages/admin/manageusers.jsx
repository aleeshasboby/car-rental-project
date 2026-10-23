// frontend/src/pages/admin/manageusers.jsx
import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole } from '../../services/userservice.js';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsersList();
  }, []);

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to sync users database catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const targetRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmChange = window.confirm(
      `Are you sure you want to change this user's privilege access level to "${targetRole.toUpperCase()}"?`
    );
    
    if (!confirmChange) return;

    try {
      await updateUserRole(userId, targetRole);
      alert('User privileges updated successfully');
      fetchUsersList();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to apply security clearance update.');
    }
  };

  const filteredUsers = users.filter((user) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            User Accounts & Clearances
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            View registered customer profiles and toggle administrative security permissions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-2.5 text-xs outline-none focus:border-white transition-colors placeholder-neutral-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-800 text-red-300 p-4 rounded-xl text-sm mb-6 text-center">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-neutral-500 flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm">Accessing user credentials database...</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto bg-[#141414] rounded-2xl border border-neutral-800 shadow-2xl shadow-black/60">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="p-4 pl-6">Identity</th>
                <th className="p-4">Registered Email</th>
                <th className="p-4">Access Role</th>
                <th className="p-4 pr-6 text-right">Clearance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-neutral-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin';

                  return (
                    <tr key={user._id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="p-4 pl-6 font-bold text-white flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </span>
                        <span>{user.name}</span>
                      </td>

                      <td className="p-4 text-xs font-medium text-neutral-400">
                        {user.email}
                      </td>

                      <td className="p-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          isAdmin 
                            ? 'bg-red-950/60 border-red-800 text-red-400' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleRoleToggle(user._id, user.role)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                            isAdmin
                              ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
                              : 'bg-white hover:bg-neutral-200 border-white text-black'
                          }`}
                        >
                          {isAdmin ? 'Demote to User' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
