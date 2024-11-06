// app/edit-account/page.js
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
import Loader from '../../components/Loader'

export default function EditAccount() {
  const { user, token, loading } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    display_name: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    rankings: false,
  });
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user && token && !loading) {
      const fetchUserDetails = async () => {
        try {
          const userId = user.sub;

          const response = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserDetails(response.data.user);
          setFormData({
            display_name: response.data.user.display_name || '',
            first_name: response.data.user.first_name || '',
            last_name: response.data.user.last_name || '',
            phone_number: response.data.user.phone_number || '',
            rankings: response.data.user.rankings || false,
          });
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [user, token, loading, router]);

  if (loading || !userDetails) {
    return <Loader />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    try {
      const userId = user.sub;

      await axios.patch(
        `https://edfrica-backend-supabase.onrender.com/api/users/${userId}`,
        {
          user: {
            display_name: formData.display_name,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            rankings: formData.rankings,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setStatusMessage('Your details have been updated successfully.');
    } catch (error) {
      console.error('Failed to update user details:', error);
      setStatusMessage('Failed to update your details. Please try again.');
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
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Edit Account</h1>
          <p className="text-2xl text-gray-600">Update your account details below.</p>
        </section>

        {/* Form Section */}
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
            {statusMessage && (
              <div className="mb-4 text-center text-green-600 font-semibold">
                {statusMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="display_name">
                  Display Name
                </label>
                <input
                  type="text"
                  id="display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleChange}
                  placeholder={userDetails ? userDetails.display_name : ''}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="first_name">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder={userDetails ? userDetails.first_name : ''}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder={userDetails ? userDetails.last_name : ''}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="phone_number">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder={userDetails ? userDetails.phone_number : ''}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </div>

              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="rankings"
                  name="rankings"
                  checked={formData.rankings}
                  onChange={handleChange}
                  className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                />
                <label htmlFor="rankings" className="ml-2 block text-gray-700">
                  Enable Rankings
                </label>
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
