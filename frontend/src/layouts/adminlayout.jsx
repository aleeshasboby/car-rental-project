// src/layouts/adminlayout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

function AdminLayout({ auth, onLogout }) {
  const location = useLocation();

  const adminLinks = [
    { to: '/admin/dashboard', label: '📊 Deploy New Fleet', icon: '⚡' },
    { to: '/admin/cars', label: '🚗 Fleet Inventory', icon: '🚘' },
    { to: '/admin/rentals', label: '📋 Rental Ledgers', icon: '📝' },
    { to: '/admin/users', label: '👥 User Accounts', icon: '👤' },
  ];

  return (
    <div className="flex min-h-screen h-screen font-sans bg-[#0a0a0a] text-white">

      {/* Fixed Left Sidebar Administrative Console */}
      <aside className="w-[270px] bg-[#121212] border-r border-neutral-800 text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Dashboard Application Branding */}
          <Link to="/" className="text-lg font-black tracking-wide mb-8 text-white flex items-center gap-2 no-underline">
            <span className="text-xl">⚙️</span>
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              CarGo Admin
            </span>
          </Link>

          {/* Main Control Links Stack */}
          <nav className="flex flex-col gap-1.5">
            {adminLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    no-underline px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all
                    ${isActive 
                      ? 'bg-white text-black shadow-lg shadow-white/5' 
                      : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-white'
                    }
                  `}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Operational Profile Card */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="text-xs text-neutral-400 mb-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            {auth?.email || 'admin@cargo.com'}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-950/80 border border-red-800 text-red-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              {auth?.role || 'admin'}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Fluid Target Canvas Area */}
      <main className="flex-grow overflow-y-auto p-8 bg-[#0a0a0a]">
        {/* Top Minimal Bar */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-900">
          <div className="text-xs text-neutral-500 font-medium">
            CarGo Fleet Management Command Center
          </div>
          <span className="text-xs text-neutral-400 font-medium flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Live Operational
          </span>
        </div>

        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;
