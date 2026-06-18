// frontend/src/app.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Framework Hooks
import UserLayout from './layouts/userlayout.jsx';
import AdminLayout from './layouts/adminlayout.jsx';

// Customer View Interfaces
import Home from './pages/user/home.jsx';
import CarBrowsing from './pages/user/carbrowsing.jsx';
import CarDetails from './pages/user/cardetails.jsx';
import MyBookings from './pages/user/mybookings.jsx';

// Administrative Command Center Pages
import Dashboard from './pages/admin/dashboard.jsx';
import ManageCars from './pages/admin/managecars.jsx';
import ManageRentals from './pages/admin/managerentals.jsx';
import ManageUsers from './pages/admin/manageusers.jsx';

// Public Security Portals
import Login from './pages/auth/login.jsx';
import Register from './pages/auth/register.jsx';

function App() {
  // Global Session State tracking
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('user_session');
    return savedAuth ? JSON.parse(savedAuth) : {
      isLoggedIn: true, // Keep true for development testing so we bypass gated blocks
      email: 'testuser@gmail.com',
      role: 'user'
    };
  });

  useEffect(() => {
    localStorage.setItem('user_session', JSON.stringify(auth));
  }, [auth]);

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, email: '', role: 'user' });
    localStorage.removeItem('user_session');
  };

  return (
    <Routes>
      {/* Public Authentication Portals */}
      <Route path="/login" element={<Login setAuth={setAuth} auth={auth} />} />
      <Route path="/register" element={<Register />} />

      {/* UNIFIED USER TRACK: This puts your layout wrappers back! 🟢 */}
      <Route path="/" element={<UserLayout auth={auth} onLogout={handleLogout} />}>
        <Route index element={<Home auth={auth} />} />
        <Route path="cars" element={<CarBrowsing />} />
        <Route path="car/:id" element={<CarDetails />} /> 
        <Route path="bookings" element={<MyBookings />} />
      </Route>

      {/* ADMINISTRATOR TRACK */}
      <Route 
        path="/admin" 
        element={
          auth.isLoggedIn && auth.role === 'admin' ? (
            <AdminLayout auth={auth} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cars" element={<ManageCars />} />
        <Route path="rentals" element={<ManageRentals />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      {/* Catch-All Safety Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;