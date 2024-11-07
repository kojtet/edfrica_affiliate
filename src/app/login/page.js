"use client";

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post(
        'https://edfrica-backend-supabase.onrender.com/api/affiliates/login', // Updated endpoint
        {
          email,
          password,
        }
      );
  
      console.log('Login response:', response.data);
  
      // Call login method from AuthContext
      login(response.data);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
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
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-center mb-6">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-brand text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-6">
          <Link href="/forgot-password">
            <span className="text-brand font-medium hover:underline cursor-pointer">
              Forgot Password?
            </span>
          </Link>
        </div>
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/register">
            <span className="text-brand font-medium hover:underline cursor-pointer">
              Create one
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
