// frontend/src/pages/auth/verify.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      // 1. Extract the secure token string out of the browser's address bar URL
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing from this link.');
        return;
      }

      try {
        // 2. Ping your custom Express backend endpoint with the token
        const response = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'The verification link is invalid or has expired.');
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 text-center">
        
        {/* STATE 1: LOADING/VERIFYING */}
        {status === 'verifying' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Verifying your email...</h2>
            <p className="mt-2 text-sm text-gray-500">Connecting to the server to securely activate your account.</p>
          </div>
        )}

        {/* STATE 2: SUCCESS */}
        {status === 'success' && (
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 font-bold text-xl">
              ✓
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Account Activated!</h2>
            <p className="mt-2 text-sm text-green-600 font-medium">{message}</p>
            <div className="mt-6">
              <Link to="/login" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition">
                Proceed to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* STATE 3: ERROR / EXPIRED */}
        {status === 'error' && (
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 font-bold text-xl">
              !
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Verification Failed</h2>
            <p className="mt-2 text-sm text-red-600 font-medium">{message}</p>
            <div className="mt-6">
              <Link to="/register" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
                Try Registering Again
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;