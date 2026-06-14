// src/layouts/userlayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/navbar';

function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global Navigation Header at the top */}
      <Navbar />
      
      {/* The individual page content renders right inside this main tag */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Global Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CarGo Rental Platform. All rights reserved.
      </footer>
    </div>
  );
}

// Explicit default export at the bottom so Vite cannot miss it
export default UserLayout;