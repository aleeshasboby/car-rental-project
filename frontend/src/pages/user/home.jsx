// frontend/src/pages/user/home.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

// Haversine formula to compute distance between coordinates in kilometers
function getDistanceKM(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 🌐 REPLACE WITH YOUR SECURED API KEY FROM GOOGLE CLOUD CONSOLE
const GOOGLE_MAPS_API_KEY = "AIzaSyB8hySfBMvmyATlQK7E-m-CckpEqBxu-9k";
const LIBRARIES = ['places'];

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const autocompleteRef = useRef(null);

  // Safely registers script tags for Google Maps services dynamically
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const regionalHubs = [
    { name: "Kattakada Market Hub, Trivandrum", lat: 8.5033, lng: 77.0852 },
    { name: "Choondupalaka Hub, Kattakada", lat: 8.5085, lng: 77.0815 },
    { name: "Guruvayur Railway Station Hub, Thrissur", lat: 10.5970, lng: 76.0460 },
    { name: "Water Metro Hub, Marine Drive, Kochi", lat: 9.9786, lng: 76.2764 },
    { name: "Calicut International Airport Hub", lat: 11.1368, lng: 75.9553 },
    { name: "Trivandrum Central Railway Station Hub", lat: 8.4867, lng: 76.9522 }
  ];

  const onAutocompleteLoad = (autocompleteInstance) => {
    autocompleteRef.current = autocompleteInstance;
    // Pinpoints autocomplete context explicitly to Indian cities/addresses
    autocompleteInstance.setComponentRestrictions({ country: 'in' });
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        alert("Please select a valid location");
        return;
      }

      const selectedPlace = {
        display_name: place.formatted_address || place.name,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setSearchQuery(selectedPlace.display_name);

      // Filters down fixed regional hubs using your 40km perimeter zone
      const nearbyHubs = regionalHubs.filter(hub => {
        const distance = getDistanceKM(selectedPlace.lat, selectedPlace.lng, hub.lat, hub.lng);
        return distance <= 40;
      });

      if (nearbyHubs.length > 0) {
        const closestHub = nearbyHubs[0];
        navigate(`/cars?lat=${closestHub.lat}&lng=${closestHub.lng}&label=${encodeURIComponent(closestHub.name)}`);
      } else {
        alert(`We located "${selectedPlace.display_name.split(',')[0]}", but there are currently no available cars within 40 km of this region.`);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (autocompleteRef.current) {
      handlePlaceChanged();
    }
  };

  if (loadError) return <div style={{ color: '#fff', textAlign: 'center', padding: '3rem' }}><h3>⚠️ Error initialization mapping frameworks.</h3></div>;
  if (!isLoaded) return <div style={{ color: '#fff', textAlign: 'center', padding: '3rem' }}><h3>Uplinking Google Maps Ecosystem... 🛰️</h3></div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000000', fontFamily: 'sans-serif' }}>
      
      {/* HERO SECTION WITH CUSTOM VEHICLE BACKGROUND */}
      <div 
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.7)), url('https://static-cdn.cars24.com/prod/auto-news24-cms/cars24-blog-images/2026/02/09/4533d794-10b5-4473-96e7-801eff61ca6c-top-11-most-expensive-cars-in-india--price-specification-and-features.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: '#ffffff',
          boxSizing: 'border-box'
        }}
      >
        
        <div style={{ maxWidth: '850px', width: '100%', zIndex: 2 }}>

          <h1 style={{ 
            fontSize: '3.8rem', 
            fontWeight: '900', 
            lineHeight: '1.15', 
            marginBottom: '1.25rem',
            letterSpacing: '-1.5px',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}>
            Your Next Journey Starts Here
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#a3a3a3', 
            lineHeight: '1.6',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            maxWidth: '650px',
            margin: '0 auto 3.5rem auto'
          }}>
            Select your nearest rental hub
          </p>

          <div style={{
            backgroundColor: '#121212', 
            padding: '2rem',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            textAlign: 'left',
            maxWidth: '700px',
            margin: '0 auto',
            border: '1px solid #262626'
          }}>
            
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                 Select Region
              </label>
              
              <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                <div style={{ flex: 1 }}>
                  {/* Google Places Autocomplete Engine hooks natively into your text field layout */}
                  <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={handlePlaceChanged}>
                    <input 
                      type="text"
                      placeholder="Search location"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1.1rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid #262626',
                        backgroundColor: '#1a1a1a', 
                        color: '#ffffff', 
                        fontSize: '1rem',
                        fontWeight: '500',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </Autocomplete>
                </div>

                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#ffffff', 
                    color: '#000000', 
                    border: 'none',
                    padding: '0 2rem',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Search
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      {/* FOOTER CONTAINER: COPYRIGHT & CONTACT NAVIGATION */}
      <footer style={{ 
        backgroundColor: '#121212', 
        color: '#a3a3a3', 
        padding: '1.5rem 2rem', 
        borderTop: '1px solid #262626',
        fontSize: '0.9rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} CarRental Co. All rights reserved.
          </div>
          
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span 
              onClick={() => navigate('/contact')} 
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#a3a3a3'}
            >
              Contact Support
            </span>
            <span 
              onClick={() => navigate('/terms')} 
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#a3a3a3'}
            >
              Terms of Service
            </span>
            <a 
              href="mailto:support@carrental.com" 
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#a3a3a3'}
            >
              support@carrental.com
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;