// src/pages/admin/managerentals.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api.js'; 

function ManageRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllRentals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/all'); 
      setRentals(Array.isArray(response.data) ? response.data : []);
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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus });
      setRentals((prevRentals) => 
        prevRentals.map((item) => 
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
      <div className="py-24 text-center text-neutral-500 flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-sm">Connecting to global rental ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Rental Ledgers & History
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Monitor real-time platform bookings, check incoming transactions, and update reservation status.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-800 text-red-300 p-4 rounded-xl text-sm mb-6 text-center">
          ⚠️ {error}
        </div>
      )}

      <div className="w-full overflow-x-auto bg-[#141414] rounded-2xl border border-neutral-800 shadow-2xl shadow-black/60">
        <table className="w-full border-collapse text-left min-w-[850px]">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/50 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              <th className="p-4 pl-6">Contract ID</th>
              <th className="p-4">Customer Email</th>
              <th className="p-4">Assigned Vehicle</th>
              <th className="p-4">Rental Span</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Current Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-sm">
            {rentals.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-12 text-center text-neutral-500">
                  No active or past bookings registered on system platform yet.
                </td>
              </tr>
            ) : (
              rentals.map((r) => {
                const bookingId = r._id || r.id;
                const start = new Date(r.startDate);
                const end = new Date(r.endDate);

                return (
                  <tr key={bookingId} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs font-bold text-neutral-300">
                      #{bookingId.substring(0, 8).toUpperCase()}
                    </td>

                    <td className="p-4 text-xs font-medium text-neutral-300">
                      👤 {r.userEmail}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white text-sm">
                        {r.car?.name || 'Registered Asset'}
                      </div>
                      <div className="text-[11px] text-neutral-500">{r.car?.brand}</div>
                    </td>

                    <td className="p-4 text-xs text-neutral-400">
                      {start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                      {end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>

                    <td className="p-4 font-black text-white text-sm">
                      ₹{(r.totalPrice || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        r.status === 'Confirmed' || r.status === 'Approved'
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                          : r.status === 'Completed'
                          ? 'bg-blue-950/60 border-blue-800 text-blue-400'
                          : r.status === 'Cancelled'
                          ? 'bg-red-950/60 border-red-800 text-red-400'
                          : 'bg-amber-950/60 border-amber-800 text-amber-400'
                      }`}>
                        {r.status || 'Confirmed'}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {r.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(bookingId, 'Completed')}
                            className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {r.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(bookingId, 'Cancelled')}
                            className="bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageRentals;
