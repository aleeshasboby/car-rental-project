// src/pages/admin/managecars.jsx
import React from 'react';

function ManageCars() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Vehicle Inventory Fleet</h2>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          + Add New Car
        </button>
      </div>
      <p className="text-gray-500 text-sm">System inventory matching configurations loaded...</p>
    </div>
  );
}

export default ManageCars;