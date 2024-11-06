// app/change-password/page.js
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import {
  FaSave,
  FaArrowLeft,
} from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';

export default function ChangePassword() {
  const { user, token, loading } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    try {
      await axios.patch(
        'https://edfrica-backend-supabase.onrender.com/api/users/change-password',
        {
          email: user.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setStatusMessage('Your password has been updated successfully.');
      setFormData({
        currentPassword: '',
        newPassword: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      setStatusMessage('Failed to change your password. Please try again.');
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
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Change Password</h1>
          <p className="text-2xl text-gray-600">Update your password below.</p>
        </section>

        {/* Form Section */}
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
            {statusMessage && (
              <div className={`mb-4 text-center ${statusMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                {statusMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
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
                  className="flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
