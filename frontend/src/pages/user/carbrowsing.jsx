// frontend/src/pages/user/carbrowsing.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllCars } from '../../services/carservice.js';

function CarBrowsing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const userLat = parseFloat(searchParams.get('lat'));
  const userLng = parseFloat(searchParams.get('lng'));
  const searchLabel = searchParams.get('label');
  const hubId = searchParams.get('hubId');

  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    const fetchLiveInventory = async () => {
      try {
        setLoading(true);
        const data = await getAllCars();
        setAllCars(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load cars:", err);
        setError("Could not establish server uplink to fleet repository.");
      } finally {
        setLoading(false);
      }
    };
    fetchLiveInventory();
  }, []);

  const isFilteredSearch = Boolean(searchLabel || hubId || (!isNaN(userLat) && !isNaN(userLng)));
  
  // Filter by hub
  const hubFilteredCars = isFilteredSearch
    ? allCars.filter((car) => {
        const carHubId = car.hub?._id || car.hub;
        if (hubId && carHubId === hubId) return true;
        
        const carHubName = (car.hub?.name || car.hubName || '').toLowerCase();
        const targetedHub = (searchLabel || '').toLowerCase();
        return carHubName.includes(targetedHub) || targetedHub.includes(carHubName);
      })
    : allCars;

  // Filter by vehicle type tab
  const displayedCars = selectedType === 'ALL'
    ? hubFilteredCars
    : hubFilteredCars.filter((c) => (c.type || '').toUpperCase() === selectedType);

  const vehicleTypes = ['ALL', ...Array.from(new Set(hubFilteredCars.map(c => (c.type || 'Standard').toUpperCase())))];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Info Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-neutral-900 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-full mb-3 border border-neutral-800">
              <span className={`w-2 h-2 rounded-full ${isFilteredSearch ? 'bg-emerald-400' : 'bg-blue-400'}`} />
              {isFilteredSearch ? 'Terminal Station Active' : 'Complete Fleet Catalog'}
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {isFilteredSearch ? `Fleet at ${searchLabel?.split(',')[0]}` : 'Explore All Vehicles'}
            </h1>
            
            <p className="text-neutral-400 mt-2 text-sm sm:text-base max-w-2xl">
              {isFilteredSearch 
                ? `Showing vehicles staged at this pickup hub ready for immediate reservation. Found ${displayedCars.length} available.` 
                : `Displaying all ${displayedCars.length} vehicles currently active in our fleet registry.`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isFilteredSearch && (
              <Link 
                to="/hubs"
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all no-underline"
              >
                ← All Hubs
              </Link>
            )}
            <button 
              onClick={() => navigate('/')}
              className="bg-white hover:bg-neutral-200 text-black px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-none shadow-md"
            >
              Change Location
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        {vehicleTypes.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-semibold text-neutral-500 uppercase mr-2">Category:</span>
            {vehicleTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  selectedType === t
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white border-neutral-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24 text-neutral-500 flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-sm font-medium">Scanning vehicle fleet sensors...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-950/40 border border-red-800/60 text-red-300 p-4 rounded-xl text-sm mb-8 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Empty Catalog State */}
        {!loading && displayedCars.length === 0 && (
          <div className="text-center py-24 bg-[#121212] rounded-2xl border border-neutral-800 max-w-xl mx-auto px-6">
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="text-xl font-bold text-white mb-2">No Vehicles Found</h3>
            <p className="text-neutral-400 text-sm mb-6">
              There are no operational vehicles matching this category at this station right now.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/hubs"
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all"
              >
                Check Other Hubs
              </Link>
              <button
                onClick={() => setSelectedType('ALL')}
                className="bg-white hover:bg-neutral-200 text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-none"
              >
                View All Types
              </button>
            </div>
          </div>
        )}

        {/* Vehicle Catalog Grid */}
        {!loading && displayedCars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCars.map((car) => {
              const isBookedOut = car.isAvailable === false;
              const isAnActualImageFile =
                car.image &&
                (car.image.startsWith('http') ||
                  car.image.startsWith('/') ||
                  car.image.startsWith('data:'));

              return (
                <div 
                  key={car._id} 
                  className="bg-[#141414] hover:bg-[#181818] border border-neutral-800/80 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-white/5"
                >
                  {/* Top Image Showcase */}
                  <div className="relative h-48 bg-gradient-to-b from-neutral-900 to-[#141414] p-4 flex items-center justify-center overflow-hidden border-b border-neutral-800/50">
                    {isAnActualImageFile ? (
                      <img 
                        src={car.image} 
                        alt={car.name} 
                        className={`max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
                          isBookedOut ? 'opacity-40 grayscale' : 'opacity-100'
                        }`} 
                      />
                    ) : (
                      <div className="text-6xl select-none group-hover:scale-110 transition-transform">
                        {car.image || (car.type?.toLowerCase().includes('suv') ? '🚙' : '🚘')}
                      </div>
                    )}

                    {/* Availability Tag */}
                    <div className="absolute top-3 right-3">
                      {isBookedOut ? (
                        <span className="bg-red-950/80 border border-red-800 text-red-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          Booked Out
                        </span>
                      ) : (
                        <span className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Ready for dispatch
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand & Type */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                          {car.brand || 'Premium'}
                        </span>
                        <span className="text-xs font-semibold bg-neutral-900 text-neutral-300 border border-neutral-800 px-2.5 py-0.5 rounded-md">
                          {car.type || 'Standard'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neutral-100 transition-colors">
                        {car.name}
                      </h3>

                      {/* Terminal Location */}
                      <div className="bg-neutral-900/70 border border-neutral-800/70 rounded-xl p-3 mb-4 flex items-center gap-2 text-xs text-neutral-300">
                        <span className="text-sm">📍</span>
                        <span className="truncate font-medium">
                          {car.hub?.name || car.hubName || 'Standard Pickup Bay'}
                        </span>
                      </div>

                      {/* Specifications */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 mb-6 pb-4 border-b border-neutral-800/60">
                        <div className="flex items-center gap-1.5">
                          <span>🪑</span>
                          <span>{car.seats || 5} Seats</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>⛽</span>
                          <span>{car.fuelType || 'Petrol / Hybrid'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div>
                        <div className="text-2xl font-black text-white">
                          ₹{car.rentPerDay || car.pricePerDay || 2500}
                        </div>
                        <span className="text-[11px] text-neutral-500 font-medium">per calendar day</span>
                      </div>

                      {isBookedOut ? (
                        <button 
                          disabled
                          className="bg-neutral-800 text-neutral-500 text-xs font-bold px-4 py-3 rounded-xl cursor-not-allowed border border-neutral-800"
                        >
                          Unavailable
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            const activeToken = sessionStorage.getItem('token');
                            if (!activeToken) {
                              navigate('/login', { state: { redirectTo: `/car/${car._id}` } });
                            } else {
                              navigate(`/car/${car._id}`);
                            }
                          }}
                          className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer border-none shadow-md group-hover:shadow-white/10"
                        >
                          Book Now
                        </button>
                      )}
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

export default CarBrowsing;
