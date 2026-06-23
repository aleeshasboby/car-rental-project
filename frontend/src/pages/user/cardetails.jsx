// frontend/src/pages/user/cardetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById } from '../../services/carservice.js';
import { createBooking } from '../../services/rentalservice.js';

function CarDetails({ auth }) {
  const { id } = useParams(); // Catches the /car/:id variable from the route path
  const navigate = useNavigate();
  console.log("Captured Vehicle Database ID String from browser URL:", id);
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Booking Inputs
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Automatically bind the form email input field to the active logged-in account session
  useEffect(() => {
    const resolvedEmail = auth?.email || JSON.parse(sessionStorage.getItem('user'))?.email || '';
    setUserEmail(resolvedEmail);
  }, [auth]);

  // Fetch the target car profile details from MongoDB Atlas on mount
  useEffect(() => {
    const fetchCarProfile = async () => {
      try {
        setLoading(true);
        const data = await getCarById(id);
        setCar(data);
      } catch (err) {
        console.error(err);
        setError("Could not retrieve vehicle information.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarProfile();
  }, [id]);

  // CALCULATION ENGINE: Dynamically outputs absolute days & overall total invoice amount
  const calculateTotalInvoice = () => {
    if (!startDate || !endDate || !car) return { days: 0, total: 0 };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    
    // Convert time mismatch values safely to total calendar day values
    const days = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    if (days <= 0) return { days: 0, total: 0 };
    
    // 🟢 FIXED: Prioritizing your direct database input price tag for the arithmetic loop
    const operationalPrice = car.rentPerDay !== undefined ? car.rentPerDay : (car.pricePerDay || 0);
    return { days, total: days * operationalPrice };
  };

  const { days, total } = calculateTotalInvoice();

  // SUBMISSION LOGIC
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (days <= 0) {
      alert("Please select a valid end date that is after the start date.");
      return;
    }

    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('token');
      
      const payload = {
        car: car._id,
        userEmail: userEmail,
        startDate: startDate,
        endDate: endDate,
        totalPrice: total
      };

      await createBooking(payload, token);
      setBookingSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to confirm reservation. Ensure backend endpoint parameters match.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', fontFamily: 'sans-serif', color: '#64748b' }}><h3>Loading fleet asset parameters... ⏳</h3></div>;
  if (error) return <div style={{ textAlign: 'center', padding: '5rem', fontFamily: 'sans-serif', color: '#ef4444' }}><h3>⚠️ {error}</h3></div>;
  if (!car) return null;

  // 🟢 FIXED: Safely identify if the string is a valid file link or direct base64 data stream
  const isAnActualImageFile = car.image && (car.image.startsWith('http') || car.image.startsWith('/') || car.image.startsWith('data:'));

  return (
    <div style={{ minHeight: '90vh', backgroundColor: '#f8fafc', padding: '3rem 2rem', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: VEHICLE DETAILS DISPLAY CARD */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
          
          {/* 🟢 FIXED: Constrains image and prevents text fallback overflow */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden', padding: '1rem', border: '1px solid #f1f5f9' }}>
            {isAnActualImageFile ? (
              <img 
                src={car.image} 
                alt={car.name} 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
              />
            ) : (
              <div style={{ fontSize: '6rem' }}>
                {car.image || (car.type?.toLowerCase().includes('suv') ? '🚙' : car.type?.toLowerCase().includes('sedan') ? '🚘' : '🚗')}
              </div>
            )}
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{car.name}</h1>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.3rem 0.7rem', borderRadius: '6px', textTransform: 'uppercase' }}>{car.type}</span>
          
          <hr style={{ margin: '1.5rem 0', border: '0', borderTop: '1px solid #f1f5f9' }} />
          
          {/* 🟢 FIXED: Replaced raw asterisks markdown with semantic HTML tags */}
          <p style={{ margin: '0 0 0.75rem 0', color: '#475569', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            📍 <strong>Garaged at:</strong> {car.hub?.name || car.hubName || 'Main Station'}
          </p>
          <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {car.address || 'Operational Station Hub Complex Area'}
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            <div style={{ minWidth: '80px' }}><span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Capacity</span><strong style={{ color: '#0f172a' }}>💺 {car.seats || 5} Seats</strong></div>
            <div style={{ minWidth: '80px' }}><span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Propulsion</span><strong style={{ color: '#0f172a' }}>⛽ {car.fuelType}</strong></div>
            {/* 🟢 FIXED: Ensuring layout price calculation renders rentPerDay value consistently */}
            <div style={{ minWidth: '80px' }}><span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Rate</span><strong style={{ color: '#2563eb' }}>₹{car.rentPerDay !== undefined ? car.rentPerDay : car.pricePerDay}/day</strong></div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING SCHEDULER TRANSACTIONS FORM */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
          {bookingSuccess ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
              <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.5' }}>Your rental request has been registered in the database engine for <strong>{userEmail}</strong>.</p>
              <button onClick={() => navigate('/bookings')} style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', width: '100%' }}>View My Rentals</button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1.5rem 0' }}>Configure Rental Schedule</h2>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>CUSTOMER UPLINK EMAIL</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  required 
                  disabled
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>START DATE</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>END DATE</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* DYNAMIC RECEIPT METRICS SUMMARY */}
              {days > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#166534', marginBottom: '0.5rem' }}>
                    <span>Duration:</span>
                    <strong>{days} {days === 1 ? 'Day' : 'Days'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#14532d', fontWeight: 'bold', paddingTop: '0.5rem', borderTop: '1px dashed #bbf7d0' }}>
                    <span>Total Cost:</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitting || days <= 0} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: days > 0 ? '#2563eb' : '#cbd5e1', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: days > 0 ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s' }}>
                {submitting ? 'Processing Transaction...' : 'Confirm Rental Booking'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default CarDetails;