// frontend/src/pages/user/cardetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCarById } from '../../services/carservice.js';
import { createBooking } from '../../services/rentalservice.js';

function CarDetails({ auth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Inputs
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const resolvedEmail = auth?.email || JSON.parse(sessionStorage.getItem('user') || '{}')?.email || '';
    setUserEmail(resolvedEmail);
  }, [auth]);

  useEffect(() => {
    const fetchCarProfile = async () => {
      try {
        setLoading(true);
        const data = await getCarById(id);
        setCar(data);
      } catch (err) {
        console.error(err);
        setError("Could not retrieve vehicle profile from fleet network.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarProfile();
  }, [id]);

  const calculateTotalInvoice = () => {
    if (!startDate || !endDate || !car) return { days: 0, total: 0 };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const days = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    if (days <= 0) return { days: 0, total: 0 };
    
    const operationalPrice = car.rentPerDay !== undefined ? car.rentPerDay : (car.pricePerDay || 0);
    return { days, total: days * operationalPrice };
  };

  const { days, total } = calculateTotalInvoice();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (days <= 0) {
      alert("Please select a return date that is after the pickup date.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        car: car._id,
        userEmail: userEmail,
        startDate: startDate,
        endDate: endDate,
        totalPrice: total,
      };

      await createBooking(payload);
      setBookingSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Failed to confirm reservation. Please sign in and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-400 flex flex-col items-center justify-center gap-3">
        <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-sm font-medium">Fetching technical specs and bay telemetry...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">{error || "Vehicle Not Found"}</h2>
        <p className="text-neutral-400 text-sm mb-6">The vehicle profile requested does not exist or has been decommissioned.</p>
        <Link to="/cars" className="bg-white text-black font-bold text-sm px-6 py-3 rounded-xl no-underline">
          Return to Fleet Catalog
        </Link>
      </div>
    );
  }

  const isAnActualImageFile =
    car.image &&
    (car.image.startsWith('http') ||
      car.image.startsWith('/') ||
      car.image.startsWith('data:'));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8 font-medium">
          <Link to="/" className="hover:text-white transition-colors no-underline text-neutral-400">Home</Link>
          <span>/</span>
          <Link to="/hubs" className="hover:text-white transition-colors no-underline text-neutral-400">Hubs</Link>
          <span>/</span>
          <Link to="/cars" className="hover:text-white transition-colors no-underline text-neutral-400">Fleet</Link>
          <span>/</span>
          <span className="text-white truncate">{car.name}</span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Vehicle Profile Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60">
            
            {/* Visual Frame */}
            <div className="relative bg-gradient-to-b from-neutral-900 to-[#141414] rounded-2xl h-72 sm:h-80 flex items-center justify-center p-6 mb-6 overflow-hidden border border-neutral-800/60">
              {isAnActualImageFile ? (
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl" 
                />
              ) : (
                <div className="text-8xl select-none">
                  {car.image || (car.type?.toLowerCase().includes('suv') ? '🚙' : '🚘')}
                </div>
              )}

              <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {car.type || 'Standard'}
              </span>
            </div>

            {/* Title & Brand */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                  {car.brand || 'Official CarGo Asset'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {car.name}
                </h1>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-white">
                  ₹{car.rentPerDay !== undefined ? car.rentPerDay : car.pricePerDay}
                </div>
                <span className="text-xs text-neutral-400 font-medium">per calendar day</span>
              </div>
            </div>

            {/* Station Garaged Banner */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Garaged Station Terminal</div>
                  <div className="text-sm font-semibold text-white">
                    {car.hub?.name || car.hubName || 'Central Hub Terminal Bay'}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Specs Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-3 text-center">
                <span className="text-xs text-neutral-400 block mb-1">Passenger Cap</span>
                <strong className="text-white text-sm">🪑 {car.seats || 5} Seats</strong>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-3 text-center">
                <span className="text-xs text-neutral-400 block mb-1">Powertrain</span>
                <strong className="text-white text-sm">⛽ {car.fuelType || 'Hybrid'}</strong>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-3 text-center">
                <span className="text-xs text-neutral-400 block mb-1">Access Method</span>
                <strong className="text-emerald-400 text-sm">⚡ Smart Key</strong>
              </div>
            </div>

          </div>

          {/* RIGHT: Booking Scheduler Transaction Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 sticky top-24">
            
            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Reservation Confirmed</h2>
                <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                  Your reservation contract for <strong className="text-white">{car.name}</strong> has been secured for <strong className="text-white">{userEmail}</strong>.
                </p>
                <button 
                  onClick={() => navigate('/bookings')}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3.5 rounded-xl transition-all cursor-pointer border-none shadow-lg shadow-white/10"
                >
                  View My Reservations →
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Reserve Fleet Asset</h2>
                  <p className="text-xs text-neutral-400 mt-1">Select your rental period to calculate automated pricing.</p>
                </div>

                {/* Email Account */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Contract Signer Email
                  </label>
                  <input 
                    type="email" 
                    value={userEmail}
                    disabled
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm rounded-xl px-4 py-3 cursor-not-allowed outline-none"
                  />
                  {!userEmail && (
                    <p className="text-xs text-amber-400 mt-1">
                      ⚠️ Please sign in before confirming this reservation.
                    </p>
                  )}
                </div>

                {/* Dates Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Pickup Date
                    </label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm rounded-xl px-3 py-3 outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Return Date
                    </label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm rounded-xl px-3 py-3 outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {/* Dynamic Invoice Ledger */}
                {days > 0 && (
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Rental Duration</span>
                      <strong className="text-white">{days} {days === 1 ? 'Calendar Day' : 'Calendar Days'}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Base Daily Rate</span>
                      <strong className="text-white">₹{car.rentPerDay || car.pricePerDay} / day</strong>
                    </div>
                    <div className="border-t border-neutral-800 pt-3 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-white">Estimated Total</span>
                      <span className="text-2xl font-black text-emerald-400">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <button 
                  type="submit" 
                  disabled={submitting || days <= 0}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-extrabold text-sm py-4 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-none shadow-xl shadow-white/5 flex items-center justify-center gap-2 mt-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Authorizing Booking...
                    </>
                  ) : days > 0 ? (
                    `Confirm Reservation • ₹${total.toLocaleString('en-IN')}`
                  ) : (
                    'Select Pickup & Return Dates'
                  )}
                </button>

                <p className="text-[11px] text-neutral-500 text-center">
                  Free cancellation up to 6 hours before scheduled pickup time.
                </p>
              </form>
            )}

          </div>

        </div>

      </div>
    </motion.div>
  );
}

export default CarDetails;
