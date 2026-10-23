// frontend/src/pages/user/home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import carImage from '../../assets/black-car.png';

export default function Home({ auth }) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Search & Geocoding State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Transition Animation State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced OpenStreetMap Nominatim API Location Lookup
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&addressdetails=1&limit=5&countrycodes=in`
        );
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch location suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click Outside Listener for Autocomplete Dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item) => {
    const loc = {
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    };
    setSelectedLocation(loc);
    setSearchQuery(item.display_name.split(',')[0]);
    setShowDropdown(false);
    setErrorMessage('');
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (isTransitioning) return;

    let targetLocation = selectedLocation;

    // If user typed without clicking dropdown, try the first suggestion or generate coordinates
    if (!targetLocation) {
      if (suggestions.length > 0) {
        const first = suggestions[0];
        targetLocation = {
          name: first.display_name,
          lat: parseFloat(first.lat),
          lng: parseFloat(first.lon),
        };
        setSelectedLocation(targetLocation);
      } else if (searchQuery.trim().length >= 2) {
        // Fallback default coordinates for search term
        targetLocation = {
          name: searchQuery.trim(),
          lat: 9.9312,
          lng: 76.2673, // Kochi coordinates as fallback center
        };
        setSelectedLocation(targetLocation);
      }
    }

    // Step 1: Validate location
    if (!targetLocation && (!searchQuery || searchQuery.trim().length === 0)) {
      setErrorMessage('Please enter a location to discover nearby rental hubs.');
      return;
    }

    setErrorMessage('');
    setShowDropdown(false);
    setIsTransitioning(true);

    // If prefers-reduced-motion is enabled, skip long scale animation and navigate promptly
    const transitionDuration = shouldReduceMotion ? 600 : 2000;

    setTimeout(() => {
      navigate('/hubs', {
        state: {
          location: targetLocation || { name: searchQuery.trim() },
        },
      });
    }, transitionDuration);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-white overflow-hidden flex flex-col justify-between selection:bg-white/20">
      
      {/* ══════════════════════════════════════════════════════
          BACKGROUND RADIAL GLOW & LIGHTING
          ══════════════════════════════════════════════════════ */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        animate={
          isTransitioning && !shouldReduceMotion
            ? {
                background:
                  'radial-gradient(circle at 50% 65%, rgba(255, 255, 255, 0.45) 0%, rgba(120, 120, 120, 0.25) 35%, rgba(0, 0, 0, 0.95) 70%, #000000 100%)',
              }
            : {
                background:
                  'radial-gradient(circle at 50% 68%, rgba(180, 180, 180, 0.18) 0%, rgba(60, 60, 60, 0.08) 40%, rgba(0, 0, 0, 0.8) 75%, #000000 100%)',
              }
        }
        transition={{ duration: 1.8, ease: 'easeIn' }}
      />

      {/* ══════════════════════════════════════════════════════
          HERO TOP NAVIGATION BAR (Animated on transition)
          ══════════════════════════════════════════════════════ */}
      <motion.header
        className="relative z-30 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between"
        animate={
          isTransitioning
            ? { opacity: 0, y: -40, filter: 'blur(4px)' }
            : { opacity: 1, y: 0, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-extrabold text-white tracking-tight no-underline flex items-center gap-2">
          <span className="text-2xl">🚗</span>
          <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            CarGo
          </span>
        </Link>

        {/* Center Nav Links (Hidden on small mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-white no-underline">
            Home
          </Link>
          <Link to="/hubs" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors no-underline">
            Hubs
          </Link>
          <Link to="/cars" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors no-underline">
            Fleet
          </Link>
          <Link to="/contact" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors no-underline">
            Contact
          </Link>
          <Link to="/contact" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors no-underline">
            Community
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {auth && auth.isLoggedIn ? (
            <Link
              to="/bookings"
              className="text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-full no-underline transition-all"
            >
              My Bookings
            </Link>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2 bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-xs font-semibold text-black bg-white hover:bg-neutral-200 px-5 py-2 rounded-lg transition-all border-none cursor-pointer shadow-md shadow-white/10"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </motion.header>

      {/* ══════════════════════════════════════════════════════
          HERO HEADLINE & LOCATION SEARCH (Animated on transition)
          ══════════════════════════════════════════════════════ */}
      <motion.div
        className="relative z-20 flex-1 flex flex-col items-center justify-start pt-6 sm:pt-10 px-6 text-center"
        animate={
          isTransitioning
            ? { opacity: 0, y: -50, scale: 0.95, filter: 'blur(6px)' }
            : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-3xl w-full mx-auto">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] mb-4">
            Rent Cars, <br className="hidden sm:inline" />
            <span className="text-neutral-300">Build Trust</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Premium fleet rentals across regional transit terminals. Real-time availability, zero friction.
          </p>

          {/* Search Bar Container */}
          <div ref={dropdownRef} className="relative max-w-xl mx-auto w-full">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 bg-[#121212]/90 backdrop-blur-xl p-2 rounded-2xl border border-neutral-800 shadow-2xl shadow-black/80">
              
              {/* Input Field */}
              <div className="relative flex-1 flex items-center">
                <span className="pl-4 pr-2 text-neutral-500 text-lg">📍</span>
                <input
                  type="text"
                  placeholder="Enter city, airport, or station..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedLocation(null);
                    setShowDropdown(true);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  disabled={isTransitioning}
                  className="w-full bg-transparent text-white placeholder-neutral-500 text-sm sm:text-base py-3 pr-4 focus:outline-none"
                />
                {isSearching && (
                  <span className="pr-4 text-xs text-neutral-400 animate-pulse">Scanning...</span>
                )}
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isTransitioning}
                className="bg-white hover:bg-neutral-200 text-black font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-white/10"
              >
                {isTransitioning ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Search nearby hubs'
                )}
              </button>
            </form>

            {/* Validation Message */}
            {errorMessage && (
              <p className="text-red-400 text-xs sm:text-sm mt-2 font-medium text-left px-2">
                ⚠️ {errorMessage}
              </p>
            )}

            {/* Location Autocomplete Dropdown */}
            {showDropdown && suggestions.length > 0 && !isTransitioning && (
              <ul className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl z-50 text-left list-none p-0 m-0 max-h-60 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer border-b border-neutral-800/50 last:border-none transition-colors flex items-center gap-3"
                  >
                    <span className="text-neutral-500 text-xs">📌</span>
                    <span className="truncate">{item.display_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          HERO CAR IMAGE & ZOOM TRANSITION
          ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full flex justify-center items-end pointer-events-none select-none">
        <motion.div
          className="relative w-full max-w-4xl px-4 sm:px-8 flex justify-center"
          initial={{ scale: 1, opacity: 1 }}
          animate={
            isTransitioning && !shouldReduceMotion
              ? {
                  scale: 16,
                  opacity: 0.9,
                  transition: {
                    duration: 2.0,
                    ease: [0.7, 0, 0.84, 0], // dramatic ease-in curve
                  },
                }
              : { scale: 1, opacity: 1 }
          }
          style={{
            transformOrigin: '50% 35%', // Focused near the windshield & front grille
          }}
        >
          <img
            src={carImage}
            alt="CarGo Luxury Vehicle"
            className="w-[90%] sm:w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]"
          />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BLACKOUT FADE OVERLAY (Fades to black at 1.5s)
          ══════════════════════════════════════════════════════ */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-40 bg-black"
        initial={{ opacity: 0 }}
        animate={
          isTransitioning
            ? {
                opacity: 1,
                transition: {
                  delay: shouldReduceMotion ? 0.1 : 1.4,
                  duration: shouldReduceMotion ? 0.4 : 0.6,
                  ease: 'easeInOut',
                },
              }
            : { opacity: 0 }
        }
      />

      {/* ══════════════════════════════════════════════════════
          FOOTER COPYRIGHT & SECONDARY LINKS
          ══════════════════════════════════════════════════════ */}
      <motion.footer
        className="relative z-20 w-full border-t border-neutral-900 bg-black/60 backdrop-blur-md py-4 px-6 text-xs text-neutral-500"
        animate={isTransitioning ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} CarGo Mobility Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="text-neutral-400 hover:text-white no-underline transition-colors">
              Support
            </Link>
            <Link to="/terms" className="text-neutral-400 hover:text-white no-underline transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </motion.footer>

    </div>
  );
}
