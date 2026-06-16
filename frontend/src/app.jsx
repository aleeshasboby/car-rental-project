// src/app.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Framework Hooks
import UserLayout from './layouts/userlayout';
import AdminLayout from './layouts/adminlayout';

// Customer View Interfaces
import Home from './pages/user/home';
import CarBrowsing from './pages/user/carbrowsing';
import MyBookings from './pages/user/mybookings';

// Administrative Command Center Pages
import Dashboard from './pages/admin/dashboard';
import ManageCars from './pages/admin/managecars';
import ManageRentals from './pages/admin/managerentals';
import ManageUsers from './pages/admin/manageusers';

// Public Security Portals
import Login from './pages/auth/login';
import Register from './pages/auth/register';

function App() {
  // Global Session State initialized from LocalStorage
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('user_session');
    return savedAuth ? JSON.parse(savedAuth) : {
      isLoggedIn: false,
      email: '',
      role: 'user'
    };
  });

  // Keep LocalStorage in sync whenever auth state changes
  useEffect(() => {
    localStorage.setItem('user_session', JSON.stringify(auth));
  }, [auth]);

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, email: '', role: 'user' });
    localStorage.removeItem('user_session');
  };

  return (
    <Router>
      <Routes>
        {/* Public Authentication Portals */}
        <Route path="/login" element={<Login setAuth={setAuth} auth={auth} />} />
        <Route path="/register" element={<Register />} />

        {/* 
          PUBLIC TRACK: Anyone can see the Home page. 
          The UserLayout will handle showing "Login" or "Logout" buttons 
          based on the auth state automatically.
        */}
        <Route path="/" element={<UserLayout auth={auth} onLogout={handleLogout} />}>
          <Route index element={<Home auth={auth} />} />
        </Route>

        {/* 
          PROTECTED CLIENT TRACK: Gated content. 
          Users must be logged in to browse the full catalog or see bookings.
        */}
        <Route 
          path="/" 
          element={
            auth.isLoggedIn && auth.role === 'user' ? (
              <UserLayout auth={auth} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="cars" element={<CarBrowsing />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>

        {/* 
          ADMINISTRATOR TRACK: Gated specifically for Admin roles.
        */}
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
    </Router>
  );
}

export default App;