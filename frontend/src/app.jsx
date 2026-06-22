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
import AddCar from './pages/admin/addcar.jsx'; 
import ManageCars from './pages/admin/managecars.jsx';
import ManageRentals from './pages/admin/managerentals.jsx';
import ManageUsers from './pages/admin/manageusers.jsx';

// Public Security Portals
import Login from './pages/auth/login.jsx';
import Register from './pages/auth/register.jsx';

// 🔒 CUSTOMER TRACK ROUTE GATE GUARD COMPONENT
// Blocks unauthenticated strangers from accessing private user pages manually via URL injection
function UserProtectedRoute({ auth, children }) {
  if (!auth.isLoggedIn) {
    alert("Access Denied. Please sign into your account to access your private reservation portal! 🔒");
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  // Global Session State tracking
  const [auth, setAuth] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return {
        isLoggedIn: true,
        email: parsed.email,
        role: parsed.role
      };
    }
    
    return {
      isLoggedIn: false, 
      email: '',
      role: 'user'
    };
  });

  useEffect(() => {
    if (auth.isLoggedIn) {
      const basicUserData = { email: auth.email, role: auth.role };
      sessionStorage.setItem('user', JSON.stringify(basicUserData));
    }
  }, [auth]);

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, email: '', role: 'user' });
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <Routes>
      {/* Public Authentication Portals */}
      <Route path="/login" element={<Login setAuth={setAuth} auth={auth} />} />
      <Route path="/register" element={<Register />} />

      {/* UNIFIED USER TRACK */}
      <Route path="/" element={<UserLayout auth={auth} onLogout={handleLogout} />}>
        <Route index element={<Home auth={auth} />} />
        <Route path="cars" element={<CarBrowsing />} />
        <Route path="car/:id" element={<CarDetails />} /> 
        
        {/* 🟢 PROTECTED: Wrapped in user authentication guard component */}
        <Route 
          path="bookings" 
          element={
            <UserProtectedRoute auth={auth}>
              <MyBookings auth={auth} />
            </UserProtectedRoute>
          } 
        />
      </Route>

      {/* ADMINISTRATOR TRACK */}
      <Route 
        path="/admin" 
        element = {
          auth.isLoggedIn && auth.role === 'admin' ? (
            <AdminLayout auth={auth} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<AddCar />} />
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