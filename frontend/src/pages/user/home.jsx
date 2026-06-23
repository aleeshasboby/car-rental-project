// frontend/src/pages/user/home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState(null);

  const regionalHubs = [
    { name: "Kattakada Market Hub, Trivandrum", lat: 8.5033, lng: 77.0852 },
    { name: "Choondupalaka Hub, Kattakada", lat: 8.5085, lng: 77.0815 },
    { name: "Guruvayur Railway Station Hub, Thrissur", lat: 10.5970, lng: 76.0460 },
    { name: "Water Metro Hub, Marine Drive, Kochi", lat: 9.9786, lng: 76.2764 },
    { name: "Calicut International Airport Hub", lat: 11.1368, lng: 75.9553 },
    { name: "Trivandrum Central Railway Station Hub", lat: 8.4867, lng: 76.9522 }
  ];

  const filteredHubs = regionalHubs.filter(hub =>
    hub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedHub) {
      navigate(`/cars?lat=${selectedHub.lat}&lng=${selectedHub.lng}&label=${encodeURIComponent(selectedHub.name)}`);
    } else if (filteredHubs.length > 0) {
      const fallbackHub = filteredHubs[0];
      navigate(`/cars?lat=${fallbackHub.lat}&lng=${fallbackHub.lng}&label=${encodeURIComponent(fallbackHub.name)}`);
    } else {
      alert("Please choose a valid hub from the selection pool! ");
    }
  };

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
          // Linear gradient shifted from blue-slate to clean black masks
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
            color: '#a3a3a3', // Soft crisp light gray text
            lineHeight: '1.6',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            maxWidth: '650px',
            margin: '0 auto 3.5rem auto'
          }}>
            Select your nearest regional transit hub terminal
          </p>

          <div style={{
            backgroundColor: '#121212', // Charcoal black form wrapper card
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
                <div style={{ flex: 1, position: 'relative' }}>
                  <input 
                    type="text"
                    placeholder="Type to search "
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedHub && e.target.value !== selectedHub.name) {
                        setSelectedHub(null);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '1.1rem 1.25rem',
                      borderRadius: '12px',
                      border: '2px solid #262626',
                      backgroundColor: '#1a1a1a', // Dark grey interior input
                      color: '#ffffff', // Input text typing color
                      fontSize: '1rem',
                      fontWeight: '500',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />

                  {searchQuery && !selectedHub && (
                    <div style={{
                      position: 'absolute',
                      top: '105%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#1a1a1a', // Black-gray flyout panel container
                      borderRadius: '12px',
                      border: '1px solid #262626',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.7)',
                      zIndex: 10,
                      maxHeight: '220px',
                      overflowY: 'auto',
                      padding: '0.5rem'
                    }}>
                      {filteredHubs.length === 0 ? (
                        <div style={{ padding: '0.75rem 1rem', color: '#737373', fontSize: '0.9rem' }}>No hubs found matching that query.</div>
                      ) : (
                        filteredHubs.map((hub, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSelectedHub(hub);
                              setSearchQuery(hub.name);
                            }}
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              fontWeight: '500',
                              color: '#ffffff', // Dropdown item list label colour
                              backgroundColor: 'transparent',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#262626'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                             {hub.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#ffffff', // High contrast stark white search button
                    color: '#000000', // Black inner button typography
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
        backgroundColor: '#121212', // Changed from deep slate blue to Material Charcoal Black
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