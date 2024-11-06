// app/redeem/page.js
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader'
import Link from 'next/link';
import { FaGift, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function RedeemCode() {
  const { user, loading } = useAuth();
  const [code, setCode] = useState('');
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

    // Dummy validation logic
    const validCodes = ['WELCOME10', 'SPRING20', 'SUMMER30'];

    if (validCodes.includes(code.toUpperCase())) {
      setStatus('success');
      setMessage(`Success! You've redeemed the code "${code.toUpperCase()}" and earned a reward.`);
      setCode('');
    } else {
      setStatus('error');
      setMessage('Invalid referral code. Please try again.');
    }
  };


  if (loading ) {
    return <Loader />;
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
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Redeem Code</h1>
          <p className="text-2xl text-gray-600">Enter your redeem code to claim your gift.</p>
        </section>

        {/* Redeem Form Section */}
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
                <label htmlFor="code" className="block text-gray-700 font-medium mb-2">
                  Redeem Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code here"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition duration-300"
              >
                <FaGift className="mr-2" />
                Redeem
              </button>
            </form>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="container mx-auto px-4 mt-12">
          <div className="max-w-lg mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-6 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-700 mb-4">
              Redeeming a code is simple! Just enter your unique code above and claim your reward instantly.
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Codes are case-insensitive.</li>
              <li>Each code can be used once per user.</li>
              <li>Rewards vary based on the code.</li>
            </ul>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="container mx-auto px-4 mt-12 text-center">
          <Link href="/">
            <button className="flex items-center justify-center mx-auto px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition duration-300">
              <FaArrowLeft className="mr-2" />
              Back to Home
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
