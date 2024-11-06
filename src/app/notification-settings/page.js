// app/notification-settings/page.js
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader';
import axios from 'axios';

export default function NotificationSettings() {
  const { user, token, loading: authLoading } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalMaterials: true,
  });
  const [loadingData, setLoadingData] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }

    // Fetch notification settings if authenticated
    if (user && token && !authLoading) {
      const fetchNotificationSettings = async () => {
        try {
          const userId = user.sub; // Assuming user.sub is the user ID

          const response = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/notifications/notification-settings/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = response.data.notificationSettings;
          setNotificationSettings({
            emailNotifications: data.email_notifications,
            smsNotifications: data.sms_notifications,
            promotionalMaterials: data.promotional_materials,
          });

          setLoadingData(false);
        } catch (err) {
          console.error('Failed to fetch notification settings:', err);
          setError('Failed to load notification settings. Please try again later.');
          setLoadingData(false);
        }
      };

      fetchNotificationSettings();
    }
  }, [user, token, authLoading, router]);

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset status and error messages
    setStatusMessage('');
    setError(null);

    try {
      const userId = user.sub; // Assuming user.sub is the user ID

      // Prepare the data to be sent in the PUT request
      const updatedSettings = {
        email_notifications: notificationSettings.emailNotifications,
        sms_notifications: notificationSettings.smsNotifications,
        promotional_materials: notificationSettings.promotionalMaterials,
      };

      await axios.put(
        `https://edfrica-backend-supabase.onrender.com/api/notifications/notification-settings/${userId}`,
        updatedSettings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setStatusMessage('Notification settings updated successfully.');
    } catch (err) {
      console.error('Failed to update notification settings:', err);
      setError('Failed to update settings. Please try again later.');
    }
  };

  // Show the loader until authentication and data are loaded
  if (authLoading || loadingData) {
    return <Loader />;
  }

  // Show error message if there was an issue fetching data
  if (error) {
    return (
      <>
        <Navbar />
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-700">{error}</p>
          </div>
        </main>
      </>
    );
  }

  // If user is not authenticated, render nothing (already handled by redirect)
  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-white via-purple-50 to-brand min-h-screen pb-12">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Notification Settings</h1>
          <p className="text-2xl text-gray-600">Manage your notification preferences below.</p>
        </section>

        {/* Notification Settings Form */}
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
            {statusMessage && (
              <div className="mb-4 text-center text-green-600 font-semibold">
                {statusMessage}
              </div>
            )}
            {error && (
              <div className="mb-4 text-center text-red-600 font-semibold">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {/* Email Notifications */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium" htmlFor="emailNotifications">
                  Email Notifications
                </label>
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleToggle}
                  className="h-6 w-6 text-brand focus:ring-brand border-gray-300 rounded"
                />
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium" htmlFor="smsNotifications">
                  SMS Notifications
                </label>
                <input
                  type="checkbox"
                  id="smsNotifications"
                  name="smsNotifications"
                  checked={notificationSettings.smsNotifications}
                  onChange={handleToggle}
                  className="h-6 w-6 text-brand focus:ring-brand border-gray-300 rounded"
                />
              </div>

              {/* Promotional Materials */}
              <div className="flex items-center justify-between mb-6">
                <label className="text-gray-700 font-medium" htmlFor="promotionalMaterials">
                  Receive Promotional Materials
                </label>
                <input
                  type="checkbox"
                  id="promotionalMaterials"
                  name="promotionalMaterials"
                  checked={notificationSettings.promotionalMaterials}
                  onChange={handleToggle}
                  className="h-6 w-6 text-brand focus:ring-brand border-gray-300 rounded"
                />
              </div>

              {/* Action Buttons */}
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
