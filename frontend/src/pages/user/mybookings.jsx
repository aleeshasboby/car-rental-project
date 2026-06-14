// src/pages/user/mybookings.jsx
import React from 'react';

function MyBookings() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Rental History</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
        You don't have any active rentals scheduled at this time.
      </div>
    </div>
  );
}

export default MyBookings;