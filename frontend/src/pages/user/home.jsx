// src/pages/user/home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Trigger search suggestions as the user types (Debounced API call)
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      // Query OpenStreetMap's free global geocoding service with clean addressing structural fallbacks
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=10&countrycodes=in`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("OSM Geocoding Error:", err);
          setLoading(false);
        });
    }, 400); // Wait 400ms after user stops typing to save network requests

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectSuggestion = (place) => {
    setQuery(place.display_name);
    setSelectedPlace({
      label: place.display_name,
      lat: place.lat,
      lng: place.lon
    });
    setSuggestions([]); // Clear dropdown list
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlace) return;

    // Send coordinates straight to the Car Browsing page
    navigate(`/cars?lat=${selectedPlace.lat}&lng=${selectedPlace.lng}&label=${encodeURIComponent(selectedPlace.label)}`);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
          Find Cars Near You
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b' }}>
          Powered by OpenStreetMap. Type your area to check live local garage distances.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} style={{ 
        backgroundColor: '#fff', padding: '2.5rem', borderRadius: '16px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '500px', border: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            🔍 Where are you picking up?
          </label>
          
          <input 
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedPlace(null); // Clear selected coordinates if user starts typing again
            }}
            placeholder="Type city, district, airport, or neighborhood..."
            style={{ 
              width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #cbd5e1',
              fontSize: '1rem', fontWeight: '600', color: '#0f172a', outline: 'none', boxSizing: 'border-box'
            }}
          />

          {/* DYNAMIC LOADER STATUS INDICATOR */}
          {loading && <div style={{ position: 'absolute', right: '15px', top: '42px', color: '#64748b', fontSize: '0.85rem' }}>Loading...</div>}

          {/* DREPDOWN SUGGESTIONS BOX */}
          {suggestions.length > 0 && (
            <ul style={{
              position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff',
              border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '4px', padding: 0,
              listStyle: 'none', maxHeight: '220px', overflowY: 'auto', zIndex: 1000,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}>
              {suggestions.map((place) => (
                <li 
                  key={place.place_id}
                  onClick={() => handleSelectSuggestion(place)}
                  style={{
                    padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.9rem', color: '#334155', fontWeight: '500', textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                >
                  📍 {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button 
          type="submit" 
          disabled={!selectedPlace}
          style={{ 
            width: '100%', backgroundColor: selectedPlace ? '#2563eb' : '#cbd5e1', color: '#fff', border: 'none', 
            padding: '1rem', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: selectedPlace ? 'pointer' : 'not-allowed'
          }}
        >
          Search Nearby Fleet
        </button>
      </form>
    </div>
  );
}

export default Home;