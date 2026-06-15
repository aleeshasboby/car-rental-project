// src/app.jsx
import React, { useState } from 'react';
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
  // Global Session State
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    email: '',
    role: 'user'
  });

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, email: '', role: 'user' });
  };

  return (
    <Router>
      <Routes>
        {/* 
          CRITICAL REPAIR: Passing down global auth states directly into 
          the login form component so it can modify session tracking variables 
        */}
        <Route path="/login" element={<Login setAuth={setAuth} auth={auth} />} />
        <Route path="/register" element={<Register />} />

        {/* Client Access Track with State Gates */}
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
          <Route index element={<Home auth={auth} />} />
          <Route path="cars" element={<CarBrowsing />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>

        {/* Administrator Terminal Track with State Gates */}
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;