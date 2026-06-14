import React from 'react';

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Bookings</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Active Fleet</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">42 Cars</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Revenue (MTD)</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">$14,250</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;