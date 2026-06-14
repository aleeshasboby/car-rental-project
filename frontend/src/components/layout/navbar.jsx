// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  // Temporary Hardcoded States for UI Layout Testing
  // Change 'isAuthenticated' to false to see the Sign In / Register buttons!
  // Change 'userRole' to 'admin' to see the Admin Panel link!
  const isAuthenticated = true; 
  const userRole = 'user'; // Options: 'user', 'admin'

  const handleLogout = () => {
    alert("Logging out... (We will connect this to backend auth later)");
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left Side: Brand Logo and Core Links */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
              <span>🚗</span> <span className="hover:text-blue-700 transition">CarGo</span>
            </Link>
            
            {/* Dynamic Link Menu */}
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition">
                Home
              </Link>
              <Link to="/cars" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition">
                Browse Cars
              </Link>
              
              {/* Show "My Rentals" only to logged-in standard customers */}
              {isAuthenticated && userRole === 'user' && (
                <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition">
                  My Rentals
                </Link>
              )}

              {/* Show "Admin Panel" shortcut if the user is an administrator */}
              {isAuthenticated && userRole === 'admin' && (
                <Link to="/admin/dashboard" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition">
                  🛠️ Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Side: Authentication Controls */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                  Role: <span className="capitalize font-bold text-gray-700">{userRole}</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition">
                  Sign In
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition">
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}