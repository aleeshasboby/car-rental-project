// frontend/src/pages/user/carbrowsing.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllCars } from '../../services/carservice.js';

// THE HAVERSINE FORMULA: Calculates real-world distance between two GPS coordinate sets in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); 
}

function CarBrowsing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Grab search coordinates if they came from a homepage selection
  const userLat = parseFloat(searchParams.get('lat'));
  const userLng = parseFloat(searchParams.get('lng'));
  const searchLabel = searchParams.get('label');

  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveInventory = async () => {
      try {
        setLoading(true);
        const data = await getAllCars();
        setAllCars(data);
      } catch (err) {
        console.error("Failed to load cars:", err);
        setError("Could not establish server uplink.");
      } finally {
        setLoading(false);
      }
    };
    fetchLiveInventory();
  }, []);

  // 1. Calculate distances for all cars
  const processedCars = allCars.map(car => {
    const carLat = car.coordinates?.lat || car.hub?.latitude;
    const carLng = car.coordinates?.lng || car.hub?.longitude;
    
    const distance = (userLat && userLng && carLat && carLng) 
      ? calculateDistance(userLat, userLng, carLat, carLng) 
      : null;
      
    return { ...car, distanceAway: distance };
  });

  // 2. 🎯 CRITICAL FILTER LOGIC SWITCH
  const isFilteredSearch = !isNaN(userLat) && !isNaN(userLng);
  
  const displayedCars = isFilteredSearch
    ? processedCars.filter(car => car.distanceAway !== null && car.distanceAway <= 40).sort((a, b) => a.distanceAway - b.distanceAway)
    : processedCars;

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}><h3>Scanning Fleet... 📡</h3></div>;
  if (error) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444' }}><h3>⚠️ {error}</h3></div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '3rem 2rem', fontFamily: 'sans-serif' }}>
      
      {/* Header Info Banner */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 3rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isFilteredSearch ? '#16a34a' : '#2563eb', textTransform: 'uppercase' }}>
            {isFilteredSearch ? '🟢 Location Filter Active' : '🌐 Complete Fleet Inventory Overview'}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.25rem 0 0.5rem 0' }}>
            {isFilteredSearch ? `Available Fleet Near: ${searchLabel?.split(',')[0]}` : 'All Rental Vehicles'}
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            {isFilteredSearch 
              ? `Showing cars within 40km of your selection. Found ${displayedCars.length} matches.` 
              : `Displaying all ${displayedCars.length} vehicles currently registered in our systems.`}
          </p>
        </div>
        
        {isFilteredSearch && (
          <button 
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
          >
            📍 Change Location
          </button>
        )}
      </div>

      {/* VEHICLE CATALOG GRID */}
      {displayedCars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>No Vehicles Found</h3>
          <p style={{ color: '#64748b' }}>There are no operational vehicles available inside this exact perimeter zone.</p>
          <button onClick={() => navigate('/')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Return to Homepage</button>
        </div>
      ) : (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {displayedCars.map((car) => {
            const isBookedOut = car.isAvailable === false;
            
            // 🟢 FIXED: Safely check if the image is a valid URL or path string. If it's a short symbol/emoji, render it as text icon.
            const isAnActualImageFile = car.image && (car.image.startsWith('http') || car.image.startsWith('/') || car.image.startsWith('data:'));

            return (
              <div 
                key={car._id} 
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  overflow: 'hidden', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}
              >
                
                {/* Image Container Frame */}
                <div style={{ height: '180px', backgroundColor: '#f8fafc', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', opacity: isBookedOut ? 0.5 : 1 }}>
                  {isAnActualImageFile ? (
                    <img src={car.image} alt={car.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ fontSize: '5rem' }}>
                      {car.image || (car.type?.toLowerCase().includes('suv') ? '🚙' : car.type?.toLowerCase().includes('sedan') ? '🚘' : '🚗')}
                    </div>
                  )}

                  {isBookedOut && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.3rem 0.6rem', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      🔒 Fully Booked
                    </span>
                  )}
                </div>
                
                <div style={{ padding: '1.5rem', opacity: isBookedOut ? 0.75 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.25rem 0' }}>{car.name}</h3>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{car.type}</span>
                    </div>
                    {/* 🟢 FIXED: Forcing calculation order to prioritize your baseline database input price string */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>₹{car.rentPerDay || car.pricePerDay}</div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ day</span>
                    </div>
                  </div>

                  {/* Hub Terminal Label Box */}
                  <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                        📍 {car.hub?.name || car.hubName || 'Unassigned Station'}
                      </span>
                      {car.distanceAway !== null && (
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: car.distanceAway < 5 ? '#16a34a' : '#b45309' }}>
                          🏁 {car.distanceAway} km away
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#475569' }}>
                    <span>💺 {car.seats || 5} Seats</span>
                    <span>⛽ {car.fuelType}</span>
                  </div>

                  {isBookedOut ? (
                    <button 
                      disabled
                      style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#cbd5e1', color: '#64748b', border: 'none', fontWeight: '700', cursor: 'not-allowed' }}
                    >
                      Currently Unavailable
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        const activeToken = sessionStorage.getItem('token');
                        if (!activeToken) {
                          alert("Please sign in to reserve this vehicle! 🔒");
                          navigate('/login', { state: { redirectTo: `/car/${car._id}` } });
                        } else {
                          navigate(`/car/${car._id}`);
                        }
                      }}
                      style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#0f172a', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Book This Vehicle
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CarBrowsing;