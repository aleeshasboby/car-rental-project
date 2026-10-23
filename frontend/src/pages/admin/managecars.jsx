// frontend/src/pages/admin/managecars.jsx
import React, { useState, useEffect } from 'react';
import { getAllCars } from '../../services/carservice.js';

function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await getAllCars();
        if (Array.isArray(carData)) {
          setCars(carData);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-500 flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-sm">Syncing secure fleet inventory ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Active Fleet Inventory
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Full analytical ledger overview of all vehicles currently deployed to active hubs.
        </p>
      </div>

      <div className="w-full overflow-x-auto bg-[#141414] rounded-2xl border border-neutral-800 shadow-2xl shadow-black/60">
        <table className="w-full border-collapse text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/50 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              <th className="p-4 pl-6">Vehicle Asset</th>
              <th className="p-4">Hub Terminal</th>
              <th className="p-4">Classification</th>
              <th className="p-4">Powertrain</th>
              <th className="p-4">Daily Rate</th>
              <th className="p-4 pr-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-sm">
            {cars.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-neutral-500">
                  No vehicles currently registered in the database.
                </td>
              </tr>
            ) : (
              cars.map((car) => {
                const isAvailable = car.isAvailable !== false;
                const isAnActualImageFile =
                  car.image &&
                  (car.image.startsWith('http') ||
                    car.image.startsWith('/') ||
                    car.image.startsWith('data:'));

                return (
                  <tr key={car._id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      <div className="w-14 h-11 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        {isAnActualImageFile ? (
                          <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">{car.image || '🚗'}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{car.name}</div>
                        <div className="text-xs text-neutral-400">{car.brand}</div>
                      </div>
                    </td>

                    <td className="p-4 text-xs font-semibold text-neutral-300">
                      📍 {car.hub?.name || car.hubName || 'Unassigned Station'}
                    </td>

                    <td className="p-4">
                      <span className="text-xs font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md">
                        {car.type || 'Standard'}
                      </span>
                    </td>

                    <td className="p-4 text-xs text-neutral-400">
                      ⛽ {car.fuelType || 'Petrol'}
                    </td>

                    <td className="p-4 font-black text-white text-base">
                      ₹{car.rentPerDay || car.pricePerDay}
                    </td>

                    <td className="p-4 pr-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isAvailable 
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' 
                          : 'bg-red-950/60 border-red-800 text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {isAvailable ? 'Available' : 'Rented Out'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCars;
