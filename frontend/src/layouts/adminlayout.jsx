// src/layouts/adminlayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AdminLayout({ auth, onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: 'screen', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>
      
      {/* Fixed Left Sidebar Administrative Console */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', color: '#fff', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'col', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Dashboard Application Branding */}
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '2.5rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚙️ CarGo Admin
          </div>
          
          {/* Main Control Links Stack */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/admin/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', display: 'block' }}>
               Analytics Overview
            </Link>
            <Link to="/admin/cars" style={{ color: '#94a3b8', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', display: 'block' }}>
               Fleet Inventory
            </Link>
            <Link to="/admin/rentals" style={{ color: '#94a3b8', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', display: 'block' }}>
               Rental Ledgers
            </Link>
            <Link to="/admin/users" style={{ color: '#94a3b8', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', display: 'block' }}>
               User Accounts
            </Link>
          </nav>
        </div>

        {/* Admin Operational Profile Card */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {auth?.email || 'admin@cargo.com'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
              Role: {auth?.role || 'admin'}
            </span>
          </div>
          <button 
            onClick={onLogout}
            style={{ w: '100%', width: '100%', backgroundColor: '#334155', color: '#f8fafc', border: 'none', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
          >
             Logout
          </button>
        </div>
      </aside>

      {/* Main Fluid Target Canvas Area */}
      <main style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem' }}>
        {/* Top Minimal Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
            System Environment Status: <strong style={{ color: '#10b981' }}> Operational Live</strong>
          </span>
        </div>
        
        {/* Children Sub-routes display window */}
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;