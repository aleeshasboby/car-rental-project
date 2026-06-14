import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between">
        <div className="p-6">
          <Link to="/admin/dashboard" className="text-xl font-bold tracking-wider text-emerald-400 block mb-8">
            ⚙️ CarGo Admin
          </Link>
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-slate-800 text-sm font-medium transition">Dashboard Overview</Link>
            <Link to="/admin/cars" className="block px-4 py-2 rounded hover:bg-slate-800 text-sm font-medium transition">Manage Cars</Link>
            <Link to="/admin/rentals" className="block px-4 py-2 rounded hover:bg-slate-800 text-sm font-medium transition">Manage Rentals</Link>
            <Link to="/admin/users" className="block px-4 py-2 rounded hover:bg-slate-800 text-sm font-medium transition">Manage Users</Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition">
            ← Exit Admin Panel
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white h-16 shadow-sm border-b border-gray-200 flex items-center px-8">
          <h1 className="text-lg font-semibold text-gray-700">Management Dashboard Terminal</h1>
        </header>
        <main className="p-8 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Explicit default export at the bottom so Vite cannot miss it
export default AdminLayout;