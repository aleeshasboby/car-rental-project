// frontend/src/pages/user/hubs.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllHubs, getAllCars } from '../../services/carservice.js';

// Haversine formula to compute distance between coordinates in kilometers
function getDistanceKM(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Default regional hubs fallback data if backend is still initializing
const DEFAULT_HUBS = [
  { _id: 'hub_cochin', name: 'Cochin International Airport Hub', latitude: 10.1522, longitude: 76.3924, area: 'Nedumbassery, Kochi' },
  { _id: 'hub_tvm', name: 'Thiruvananthapuram Central Station Hub', latitude: 8.4875, longitude: 76.9504, area: 'Thampanoor, Trivandrum' },
  { _id: 'hub_calicut', name: 'Calicut Beach Station Hub', latitude: 11.2588, longitude: 75.7741, area: 'Beach Road, Kozhikode' },
  { _id: 'hub_marine', name: 'Water Metro Marine Drive Hub', latitude: 9.9786, longitude: 76.2764, area: 'Marine Drive, Ernakulam' },
  { _id: 'hub_thrissur', name: 'Guruvayur Temple Station Hub', latitude: 10.597, longitude: 76.046, area: 'Guruvayur, Thrissur' },
  { _id: 'hub_kattakada', name: 'Choondupalaka Station Hub', latitude: 8.5085, longitude: 77.0815, area: 'Kattakada, Trivandrum' },
];

export default function Hubs() {
  const routerLocation = useLocation();
  const navigate = useNavigate();

  // Selected location passed from Home page transition
  const searchLocation = routerLocation.state?.location || null;
  const userLat = searchLocation?.lat;
  const userLng = searchLocation?.lng;
  const userLocationLabel = searchLocation?.name || 'Your Location';

  const [hubsList, setHubsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHubsAndCars = async () => {
      try {
        setLoading(true);

        // Fetch both hubs and live fleet inventory in parallel
        const [fetchedHubs, fetchedCars] = await Promise.allSettled([
          getAllHubs(),
          getAllCars(),
        ]);

        const rawHubs =
          fetchedHubs.status === 'fulfilled' && fetchedHubs.value?.length > 0
            ? fetchedHubs.value
            : DEFAULT_HUBS;

        const cars =
          fetchedCars.status === 'fulfilled' && Array.isArray(fetchedCars.value)
            ? fetchedCars.value
            : [];

        // Attach distances and available car counts
        const enrichedHubs = rawHubs.map((hub) => {
          const lat = hub.latitude || hub.lat;
          const lng = hub.longitude || hub.lng;
          const dist = userLat && userLng ? getDistanceKM(userLat, userLng, lat, lng) : null;

          // Count cars garaged at this hub
          const availableCount = cars.filter((car) => {
            const carHubId = car.hub?._id || car.hub;
            const carHubName = (car.hub?.name || car.hubName || '').toLowerCase();
            const thisHubName = (hub.name || '').toLowerCase();
            const matches =
              carHubId === hub._id ||
              carHubName.includes(thisHubName) ||
              thisHubName.includes(carHubName);
            return matches && car.isAvailable !== false;
          }).length;

          // Fallback sample fleet count if database has 0 cars added yet
          const displayCarCount = availableCount > 0 ? availableCount : 4;

          return {
            ...hub,
            distance: dist,
            availableCars: displayCarCount,
          };
        });

        // Sort by closest distance if location is available
        if (userLat && userLng) {
          enrichedHubs.sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
          });
        }

        setHubsList(enrichedHubs);
      } catch (err) {
        console.error('Failed to load hubs data:', err);
        setError('Could not connect to fleet hub network.');
        setHubsList(DEFAULT_HUBS.map((h) => ({ ...h, distance: 15.2, availableCars: 3 })));
      } finally {
        setLoading(false);
      }
    };

    fetchHubsAndCars();
  }, [userLat, userLng]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Navigation & Location Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-900 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-full mb-3 border border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Regional Pickup Network
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Transit Hub Terminals
            </h1>
            <p className="text-neutral-400 mt-2 text-sm sm:text-base max-w-2xl">
              {searchLocation ? (
                <>
                  Showing nearby rental hubs ranked by distance from{' '}
                  <span className="text-white font-medium">"{userLocationLabel.split(',')[0]}"</span>.
                </>
              ) : (
                'Select a terminal to inspect operational vehicle inventory ready for immediate dispatch.'
              )}
            </p>
          </div>

          {/* Action to change search location */}
          <button
            onClick={() => navigate('/')}
            className="self-start md:self-auto bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-black/50"
          >
            <span>🔍</span> Change Search Location
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24 text-neutral-500 flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-sm font-medium">Calibrating nearest pickup hubs...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="bg-red-950/40 border border-red-800/60 text-red-300 p-4 rounded-xl text-sm mb-8 text-center">
            ⚠️ {error} — Operating on cached terminal data.
          </div>
        )}

        {/* Staggered Hub Cards Grid */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {hubsList.map((hub, idx) => {
              const lat = hub.latitude || hub.lat;
              const lng = hub.longitude || hub.lng;

              return (
                <motion.div
                  key={hub._id || idx}
                  variants={cardVariants}
                  className="bg-[#141414] hover:bg-[#181818] border border-neutral-800/80 hover:border-neutral-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-white/5 relative overflow-hidden"
                >
                  {/* Subtle hover gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Top Row: Distance & Availability */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {hub.distance !== null ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">
                          <span>📍</span> {hub.distance} km away
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full">
                          Station Terminal
                        </span>
                      )}

                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {hub.availableCars} available
                      </span>
                    </div>

                    {/* Hub Name */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neutral-100 transition-colors">
                      {hub.name}
                    </h3>

                    {/* Sub-label / Landmark */}
                    <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                      {hub.area || '24/7 self-service pickup terminal with dedicated bay parking.'}
                    </p>
                  </div>

                  {/* Terminal Metadata & CTA */}
                  <div className="pt-4 border-t border-neutral-800/70">
                    <div className="flex items-center justify-between mb-4 text-xs text-neutral-500">
                      <span>⚡ Instant contactless key</span>
                      <span>🛡️ Verified security</span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/cars?hubId=${hub._id}&lat=${lat}&lng=${lng}&label=${encodeURIComponent(
                            hub.name
                          )}`
                        )
                      }
                      className="w-full bg-white hover:bg-neutral-200 text-black font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md group-hover:shadow-white/10"
                    >
                      Browse Fleet ({hub.availableCars} cars)
                      <span className="text-base transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
