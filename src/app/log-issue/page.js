// src/app/log-issue/page.js

'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function LogIssue() {
  const [issueMessage, setIssueMessage] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await axios.post(
        'https://edfrica-backend-supabase.onrender.com/api/admins/issues',
        { issue_message: issueMessage }
      );

      setSuccessMessage('Issue submitted successfully.');
      setIssueMessage('');
    } catch (error) {
      console.error('Failed to submit issue:', error);
      setError('There was a problem submitting your issue. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-brand">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg mx-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Log an Issue
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="issueMessage">
                Describe your issue
              </label>
              <textarea
                id="issueMessage"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand"
                value={issueMessage}
                onChange={(e) => setIssueMessage(e.target.value)}
                rows={4}
                required
              />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
            <button
              type="submit"
              className="w-full bg-brand text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
            >
              Submit Issue
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-brand font-medium hover:underline"
            >
              Go back to Dashboard
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
