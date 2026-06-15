// src/pages/user/carbrowsing.jsx
import React, { useState } from 'react';

// Extended mock fleet dataset for realistic testing
const FLEET_DATA = [
  { id: 1, name: 'Tesla Model S', price: 90, type: 'Luxury', transmission: 'Automatic', fuel: 'Electric' },
  { id: 2, name: 'Ford Explorer', price: 75, type: 'SUV', transmission: 'Automatic', fuel: 'Petrol' },
  { id: 3, name: 'Honda Civic', price: 40, type: 'Economy', transmission: 'Manual', fuel: 'Petrol' },
  { id: 4, name: 'BMW M4 Coupé', price: 120, type: 'Luxury', transmission: 'Automatic', fuel: 'Petrol' },
  { id: 5, name: 'Jeep Wrangler', price: 85, type: 'SUV', transmission: 'Manual', fuel: 'Diesel' },
  { id: 6, name: 'Toyota Prius', price: 45, type: 'Economy', transmission: 'Automatic', fuel: 'Hybrid' },
];

function CarBrowsing() {
  // State managers for search tracking and category filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories extraction array
  const categories = ['All', 'Luxury', 'SUV', 'Economy'];

  // Filtering Logic Engine
  const filteredCars = FLEET_DATA.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || car.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Our Available Fleet</h1>
        <p className="text-gray-600 mt-2">Find and filter the perfect vehicle for your destination workspace.</p>
      </div>

      {/* Control Panel: Search Bar and Category Tabs */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input Box */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by car model (e.g., Tesla)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Filter Buttons Layout */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Results Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                {/* Car Badge Category Tag */}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  car.type === 'Luxury' ? 'text-purple-600 bg-purple-50' :
                  car.type === 'SUV' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                }`}>
                  {car.type}
                </span>

                {/* Name & Pricing */}
                <h3 className="text-xl font-bold text-gray-800 mt-3">{car.name}</h3>
                <div className="mt-2 flex items-baseline text-gray-900">
                  <span className="text-2xl font-extrabold">₹{car.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/ day</span>
                </div>

                {/* Core Machine Specs Grid */}
                <div className="grid grid-cols-2 gap-2 my-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div>⚙️ {car.transmission}</div>
                  <div>⛽ {car.fuel}</div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition text-sm shadow-sm">
                Rent Vehicle
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Warning Frame */
        <div className="text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-gray-500">
          <p className="text-lg font-medium">No vehicles found matching your criteria.</p>
          <p className="text-sm text-gray-400 mt-1">Try resetting your filters or adjusting your search phrase.</p>
        </div>
      )}
    </div>
  );
}

export default CarBrowsing;