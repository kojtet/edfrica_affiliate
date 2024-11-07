"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await axios.post('https://edfrica-backend-supabase.onrender.com/api/users/reset-password', { email });
      setSuccess(true);
      router.push('/reset-confirmed');
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand via-white to-purple-100">
      <div
        className="bg-white backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://www.edfrica.com/images/icon/ed1.png"
            alt="Logo"
            className="h-20 w-auto"
          />
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Forgot Password?
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email below to receive a password reset link.
        </p>
        <form onSubmit={handlePasswordReset}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-6">{error}</p>}
          <button
            type="submit"
            className="w-full bg-brand text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
        {success && (
          <p className="text-green-500 text-center mt-6">
            Check your email for a password reset link.
          </p>
        )}
      </div>
    </div>
  );
}
