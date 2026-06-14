// src/app.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Structure Wrappers (All lowercase paths)
import UserLayout from './layouts/userlayout';
import AdminLayout from './layouts/adminlayout';

// Customer Feature Screens (All lowercase paths)
import Home from './pages/user/home';
import CarBrowsing from './pages/user/carbrowsing';
import CarDetails from './pages/user/cardetails';
import MyBookings from './pages/user/mybookings';

// Identity Authorization Views (All lowercase paths)
import Login from './pages/auth/login';
import Register from './pages/auth/register';

// Admin System Management Terminals (All lowercase paths)
import Dashboard from './pages/admin/dashboard';
import ManageCars from './pages/admin/managecars';
import ManageRentals from './pages/admin/managerentals';
import ManageUsers from './pages/admin/manageusers';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. Standard Customer Platform Interface */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarBrowsing />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        {/* 2. Standalone Authentication Interfaces */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 3. Restricted Administrator Management Dashboards */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/cars" element={<ManageCars />} />
          <Route path="/admin/rentals" element={<ManageRentals />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        {/* 4. Broken Link Safety Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;