// src/pages/auth/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../../services/authservice.js';
import Button from '../../components/common/button';
import Input from '../../components/common/input';

function Login({ setAuth }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!setAuth) {
      console.error("Critical Error: setAuth function was not passed down correctly from App.jsx!");
      alert("Application state error. Check your App.jsx configuration.");
      return;
    }

    try {
      const data = await loginUser(email, password);

      setAuth({
        isLoggedIn: true,
        email: data.user.email,
        role: data.user.role
      });

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const destination = location.state?.redirectTo || '/';
        navigate(destination);
      }
    } catch (err) {
      console.error("Login failure:", err);
      setError(err.response?.data?.message || "Invalid credentials or server connection lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col justify-center items-center bg-[#0a0a0a] text-white px-6 py-12 font-sans selection:bg-white/20"
    >
      <div className="max-w-[420px] w-full mx-auto">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-white no-underline mb-4">
            <span>🚗</span>
            <span>CarGo</span>
          </Link>
          <h2 className="text-3xl font-black text-white tracking-tight">Access Portal</h2>
          <p className="text-neutral-400 text-sm mt-1.5">
            Sign in to manage active reservations and access vehicle keys.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141414] p-8 rounded-3xl border border-neutral-800 shadow-2xl shadow-black/80">

          {error && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 px-4 py-3 rounded-xl text-xs font-semibold mb-6 text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />

            <Button type="submit" variant="accent" fullWidth disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-xs text-neutral-400 mt-6 mb-0">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-white font-bold no-underline hover:underline ml-1">
              Create an account
            </Link>
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors no-underline">
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </motion.div>
  );
}

export default Login;
