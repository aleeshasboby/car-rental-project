// frontend/src/pages/auth/register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api.js';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z\d]/.test(password),
  };
}

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const passwordChecks = getPasswordChecks(password);
  const isPasswordStrong = PASSWORD_REGEX.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordStrong) {
      setTouchedPassword(true);
      setError('Please choose a stronger password before continuing.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      alert(response.data.message || 'Registration successful! You can now sign in.');
      navigate('/login');
    } catch (err) {
      console.error("Registration failure:", err);
      setError(err.response?.data?.message || "Could not complete account creation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center py-12 px-6 selection:bg-white/20"
    >
      <div className="w-full max-w-[440px]">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-white no-underline mb-4">
            <span>🚗</span>
            <span>CarGo</span>
          </Link>
          <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="mt-1.5 text-sm text-neutral-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-white hover:underline no-underline ml-1">
              Sign in
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141414] py-8 px-6 sm:px-8 rounded-3xl border border-neutral-800 shadow-2xl shadow-black/80">
          
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold rounded-xl text-center">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouchedPassword(true)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />

              {/* Password Strength Checklist */}
              {(touchedPassword || password.length > 0) && (
                <div className="mt-3 p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl space-y-1 text-xs">
                  <div className={passwordChecks.length ? 'text-emerald-400' : 'text-neutral-500'}>
                    {passwordChecks.length ? '✓' : '○'} At least 8 characters
                  </div>
                  <div className={passwordChecks.letter ? 'text-emerald-400' : 'text-neutral-500'}>
                    {passwordChecks.letter ? '✓' : '○'} Contains an alphabet letter
                  </div>
                  <div className={passwordChecks.number ? 'text-emerald-400' : 'text-neutral-500'}>
                    {passwordChecks.number ? '✓' : '○'} Contains a numerical digit
                  </div>
                  <div className={passwordChecks.special ? 'text-emerald-400' : 'text-neutral-500'}>
                    {passwordChecks.special ? '✓' : '○'} Contains a special symbol (!@#$%...)
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-lg shadow-white/5 mt-2"
            >
              {loading ? 'Creating Account Profile...' : 'Complete Registration'}
            </button>
          </form>
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

export default Register;
