// src/layouts/userlayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../services/authservice.js';

function UserLayout({ auth, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (auth && auth.isLoggedIn) {
      setCurrentUser(auth);
    } else {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentUser({
            isLoggedIn: true,
            email: parsed.email,
            role: parsed.role
          });
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, [auth]);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logoutUser();
      setCurrentUser(null);
    }
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/hubs', label: 'Hubs' },
    { to: '/cars', label: 'Browse Cars' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col selection:bg-white/20">
      
      {/* 
        Global Top Navigation Bar
        (Only rendered on non-home pages; Home page controls its own animated header during transitions)
      */}
      {!isHome && (
        <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="text-xl font-extrabold text-white tracking-tight no-underline flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="text-2xl">🚗</span>
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                CarGo
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    text-sm font-medium no-underline transition-colors duration-200
                    ${location.pathname === link.to 
                      ? 'text-white font-semibold' 
                      : 'text-neutral-400 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
              
              {currentUser && currentUser.isLoggedIn && (
                <Link 
                  to="/bookings" 
                  className={`
                    text-sm font-medium no-underline transition-colors duration-200
                    ${location.pathname === '/bookings'
                      ? 'text-white font-semibold'
                      : 'text-neutral-400 hover:text-white'
                    }
                  `}
                >
                  My Bookings
                </Link>
              )}
            </nav>

            {/* Account Controls */}
            <div className="flex items-center gap-3">
              {currentUser && currentUser.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
                    👤 {currentUser.email}
                  </span>
                  <button 
                    onClick={handleLogoutClick}
                    className="text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 px-4 py-2 rounded-lg transition-all duration-200 bg-transparent cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-xs font-semibold text-neutral-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 bg-transparent border-none cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="text-xs font-semibold text-black bg-white hover:bg-neutral-200 px-5 py-2 rounded-lg transition-all duration-200 border-none cursor-pointer shadow-lg shadow-white/5"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-neutral-300 hover:text-white ml-2 bg-transparent border-none cursor-pointer text-xl"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-900 px-6 py-4">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-neutral-300 hover:text-white no-underline py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                {currentUser && currentUser.isLoggedIn && (
                  <Link
                    to="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-neutral-300 hover:text-white no-underline py-2"
                  >
                    My Bookings
                  </Link>
                )}
              </nav>
            </div>
          )}
        </header>
      )}

      {/* Target Canvas */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

    </div>
  );
}

export default UserLayout;
