// src/pages/user/carbrowsing.jsx
import React from 'react';

function CarBrowsing() {
  // Mock data for UI layout testing
  const mockCars = [
    { id: 1, name: 'Sedan Deluxe', price: '$50/day', type: 'Luxury' },
    { id: 2, name: 'SUV Explorer', price: '$80/day', type: 'Adventure' },
    { id: 3, name: 'Eco Hatchback', price: '$35/day', type: 'Economy' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Fleet</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockCars.map((car) => (
          <div key={car.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {car.type}
            </span>
            <h3 className="text-xl font-bold text-gray-800 mt-3">{car.name}</h3>
            <p className="text-gray-600 mt-1 font-medium">{car.price}</p>
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarBrowsing;