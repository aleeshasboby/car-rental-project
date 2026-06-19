// frontend/src/pages/user/carbrowsing.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllCars } from '../../services/carservice.js';

// THE HAVERSINE FORMULA: Calculates real-world distance between two GPS coordinate sets in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1)); // Return rounded to 1 decimal place
}

function CarBrowsing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Grab the precise math coordinates passed from the homepage URL
  const userLat = parseFloat(searchParams.get('lat'));
  const userLng = parseFloat(searchParams.get('lng'));
  const searchLabel = searchParams.get('label') || 'Your Location';

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCHING LIVE VEHICLES FROM MONGODB
  useEffect(() => {
    const fetchLiveInventory = async () => {
      try {
        setLoading(true);
        const data = await getAllCars();
        setCars(data);
      } catch (err) {
        console.error("Failed to load cars:", err);
        setError("Could not establish server uplink. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveInventory();
  }, []);

  // 1. DYNAMIC RADIAL SCANNING (Using clean schema property accessors)
  const carsWithDistance = cars.map(car => {
    const carLat = car.coordinates?.lat;
    const carLng = car.coordinates?.lng;
    
    const distance = (userLat && userLng && carLat && carLng) 
      ? calculateDistance(userLat, userLng, carLat, carLng) 
      : 0;
      
    return { ...car, distanceAway: distance };
  });

  // 2. PRODUCTION RADIUS GATE (Only show cars within 40 kilometers of the searched spot)
  const nearbyCars = carsWithDistance.filter(car => car.distanceAway <= 40);

  // 3. SORT: Show the absolute closest vehicles first
  const sortedCars = nearbyCars.sort((a, b) => a.distanceAway - b.distanceAway);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>
        <h3>Scanning Global Hubs... 📡</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ {error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Retry Handshake</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '3rem 2rem', fontFamily: 'sans-serif' }}>
      
      {/* Search Header Banner */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 3rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🟢 Live GPS Proximity Engine Connected
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.25rem 0 0.5rem 0' }}>
            Available Fleet Near: <span style={{ color: '#2563eb', fontWeight: '700' }}>{searchLabel}</span>
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            Scanning a 40km delivery radius... Found {sortedCars.length} matches sorted by proximity.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '0.6rem 1.2rem',
            borderRadius: '6px', fontWeight: '600', color: '#475569', cursor: 'pointer'
          }}
        >
          📍 Change Search Origin
        </button>
      </div>

      {/* VEHICLE CATALOG GRID */}
      {sortedCars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>No Fleet in Your Area</h3>
          <p style={{ color: '#64748b', margin: '0 0 1.5rem 0' }}>We currently only have test garages deployed around the Mumbai Metro area.</p>
          <button onClick={() => navigate('/')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Try Searching "Andheri", "BOM Airport", or "Kurla"</button>
        </div>
      ) : (
        <div style={{ 
          maxWidth: '1200px', margin: '0 auto', display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' 
        }}>
          {sortedCars.map((car) => (
            <div key={car._id} style={{ 
              backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', 
              overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
            }}>
              
              {/* Uses car.image string (emoji placeholder) */}
              <div style={{ height: '160px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4.5rem' }}>
                {car.image || (car.type === 'SUV' ? '🚙' : '🚗')}
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.25rem 0' }}>{car.name}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {car.type}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {/* Updated to use pricePerDay */}
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>₹{car.pricePerDay}</div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ day</span>
                  </div>
                </div>

                {/* DYNAMIC DISTANCE BADGE */}
                <div style={{ 
                  backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', 
                  border: '1px solid #e2e8f0', marginBottom: '1.25rem' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>📍 {car.hubName}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: car.distanceAway < 5 ? '#16a34a' : '#b45309' }}>
                      🏁 {car.distanceAway} km away
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
                    {car.address}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#475569' }}>
                  <span>💺 {car.seats} Seats</span>
                  {/* Updated to use fuelType */}
                  <span>⛽ {car.fuelType}</span>
                </div>

                {/* UPDATED BOOKING BUTTON WITH LOGIN GATE SECURITY ROUTING 🔒 */}
                <button 
                  onClick={() => {
                    const activeToken = sessionStorage.getItem('token');
                    
                    if (!activeToken) {
                      alert("Please sign in or create an account to reserve this vehicle! 🔒");
                      navigate('/login',{ state: { redirectTo: `/car/${car._id}` } });
                    } else {
                      navigate(`/car/${car._id}`);
                    }
                  }}
                  style={{ 
                    width: '100%', marginTop: '1.25rem', padding: '0.85rem', borderRadius: '8px', 
                    backgroundColor: '#0f172a', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  Book This Vehicle
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CarBrowsing;