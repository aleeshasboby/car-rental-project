// src/pages/user/mybookings.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api.js';

function MyBookings({ auth }) {
  const navigate = useNavigate();
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalBookings = async () => {
      try {
        setLoading(true);
        const userEmail =
          auth?.email ||
          JSON.parse(sessionStorage.getItem('user') || '{}')?.email ||
          localStorage.getItem('userEmail');

        if (!userEmail) {
          setError("Session identity missing. Please sign in.");
          return;
        }

        const response = await api.get(`/bookings/${encodeURIComponent(userEmail)}`);
        setMyRides(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Database tracking link failure:", err);
        setError("Could not extract reservation ledgers from fleet server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalBookings();
  }, [auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-400 flex flex-col items-center justify-center gap-3">
        <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-sm font-medium">Decrypting personal reservation ledgers...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-neutral-900 pb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Customer Account
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My Rental Ledgers
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Live status, station departure details, and digital contract receipts.
            </p>
          </div>

          <Link
            to="/cars"
            className="self-start sm:self-auto bg-white hover:bg-neutral-200 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all no-underline shadow-md"
          >
            + Book Another Vehicle
          </Link>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/60 text-red-300 p-4 rounded-xl text-sm mb-6 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Empty State */}
        {myRides.length === 0 ? (
          <div className="text-center py-20 bg-[#141414] rounded-2xl border border-neutral-800 p-8 max-w-lg mx-auto">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Reservations</h3>
            <p className="text-neutral-400 text-sm mb-6">
              You haven't placed any vehicle bookings on this account statement profile yet.
            </p>
            <button
              onClick={() => navigate('/hubs')}
              className="bg-white hover:bg-neutral-200 text-black font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer border-none shadow-md"
            >
              Explore Nearby Hubs
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myRides.map((ride) => {
              const start = new Date(ride.startDate);
              const end = new Date(ride.endDate);
              const diffTime = Math.abs(end - start);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

              const isConfirmed =
                ride.status === 'Confirmed' ||
                ride.status === 'Approved' ||
                ride.status === 'Completed';

              return (
                <div 
                  key={ride._id || ride.id} 
                  className="bg-[#141414] hover:bg-[#171717] border border-neutral-800 rounded-2xl p-6 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-black/40"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-3xl shrink-0">
                      {ride.car?.type === 'SUV' ? '🚙' : '🚘'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                          CONTRACT #{(ride._id || ride.id).substring(0, 8).toUpperCase()}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isConfirmed 
                            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                            : 'bg-amber-950/60 border-amber-800 text-amber-400'
                        }`}>
                          ● {ride.status || 'Confirmed'}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        {ride.car?.name || 'Registered Fleet Asset'}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                        <span className="flex items-center gap-1.5">
                          <span>📅</span>
                          <span>
                            {start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                            {end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <span>⏱️</span>
                          <span>{diffDays} {diffDays === 1 ? 'Calendar Day' : 'Calendar Days'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0">
                    <span className="text-xs text-neutral-400">Total Billed</span>
                    <div className="text-2xl font-black text-white">
                      ₹{(ride.totalPrice || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </motion.div>
  );
}

export default MyBookings;
