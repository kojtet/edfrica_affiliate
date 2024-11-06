// app/close-account/page.js
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { FaTrashAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function CloseAccount() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage('');

    // Dummy validation
    if (email.toLowerCase() === user.email.toLowerCase()) {
      setStatus('success');
      setMessage('Your account has been successfully closed. All your data and subscriptions have been removed.');
      setEmail('');
      // Here you would typically handle the account closure logic
    } else {
      setStatus('error');
      setMessage('The email entered does not match our records. Please try again.');
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-white via-purple-50 to-brand min-h-screen pb-12">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Close Account</h1>
          <p className="text-2xl text-gray-600">Warning: Closing your account will delete all your data and cancel your current subscription.</p>
        </section>

        {/* Close Account Form */}
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
            {status === 'success' && (
              <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
                <FaCheckCircle className="fill-current w-6 h-6 mr-4" />
                <span className="block sm:inline">{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <FaTimesCircle className="fill-current w-6 h-6 mr-4" />
                <span className="block sm:inline">{message}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Confirm Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to confirm"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <Link href="/">
                  <button
                    type="button"
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    <FaArrowLeft className="mr-2" />
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FaTrashAlt className="mr-2" />
                  Close Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
