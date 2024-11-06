// app/privacy-settings/page.js
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Link from 'next/link';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

export default function PrivacySettings() {
  const { user, token, loading: authLoading } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    useDataForResearch: true,
    receiveMarketingEmails: false,
    shareDataWithPartners: true,
    makeProfilePublic: false,
    enableLocationTracking: true,
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

    // Fetch privacy settings if authenticated
    if (user && token && !authLoading) {
      const fetchPrivacySettings = async () => {
        try {
          const userId = user.sub; // Assuming user.sub is the user ID

          const response = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/privacy/privacy-settings/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = response.data.privacySettings;
          setPrivacySettings({
            useDataForResearch: data.data_research,
            receiveMarketingEmails: data.marketing_emails,
            shareDataWithPartners: data.share_data,
            makeProfilePublic: data.make_my_profile_public,
            enableLocationTracking: data.location_tracking,
          });

          setLoadingData(false);
        } catch (err) {
          console.error('Failed to fetch privacy settings:', err);
          setError('Failed to load privacy settings. Please try again later.');
          setLoadingData(false);
        }
      };

      fetchPrivacySettings();
    }
  }, [user, token, authLoading, router]);

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings((prevSettings) => ({
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
          dataResearch: privacySettings.useDataForResearch,
          marketingEmails: privacySettings.receiveMarketingEmails,
          shareData: privacySettings.shareDataWithPartners,
          makeMyProfilePublic: privacySettings.makeProfilePublic,
          locationTracking: privacySettings.enableLocationTracking,
      };
  
      // Log the request data
      console.log('Updated settings:', JSON.stringify(updatedSettings, null, 2));
  
      await axios.put(
        `https://edfrica-backend-supabase.onrender.com/api/privacy/privacy-settings/${userId}`,
        updatedSettings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      setStatusMessage('Privacy settings updated successfully.');
    } catch (err) {
      console.error('Failed to update privacy settings:', err);
  
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        setError(`Failed to update settings: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        console.error('Request:', err.request);
        setError('No response received from server.');
      } else {
        console.error('Error', err.message);
        setError('Failed to update settings. Please try again later.');
      }
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
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Privacy Settings</h1>
          <p className="text-2xl text-gray-600">Manage your privacy preferences below.</p>
        </section>

        {/* Privacy Settings Form */}
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
              {/* Use Data for Research */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium" htmlFor="useDataForResearch">
                  Use my data for research
                </label>
                <input
                  type="checkbox"
                  id="useDataForResearch"
                  name="useDataForResearch"
                  checked={privacySettings.useDataForResearch}
                  onChange={handleToggle}
                  className="h-6 w-6 text-brand focus:ring-brand border-gray-300 rounded"
                />
              </div>

              {/* Receive Marketing Emails */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium" htmlFor="receiveMarketingEmails">
                  Receive marketing emails
                </label>
                <input
                  type="checkbox"
                  id="receiveMarketingEmails"
                  name="receiveMarketingEmails"
                  checked={privacySettings.receiveMarketingEmails}
                  onChange={handleToggle}
                  className="h-6 w-6 text-brand focus:ring-brand border-gray-300 rounded"
                />
              </div>

              {/* Share Data with Partners */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium" htmlFor="shareDataWithPartners">
                  Share data with partners
                </label>
                <input
                  type="checkbox"
                  id="shareDataWithPartners"
                  name="shareDataWithPartners"
                  checked={privacySettings.shareDataWithPartners}
                  onChange={handleToggle}
                  className="h-6 w-6 text-brand focus:ring-brand border-gray-300 rounded"
                />
              </div>

              {/* Make Profile Public */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium" htmlFor="makeProfilePublic">
                  Make my profile public
                </label>
                <input
                  type="checkbox"
                  id="makeProfilePublic"
                  name="makeProfilePublic"
                  checked={privacySettings.makeProfilePublic}
                  onChange={handleToggle}
                  className="h-6 w-6 text-brand focus:ring-brand border-gray-300 rounded"
                />
              </div>

              {/* Enable Location Tracking */}
              <div className="flex items-center justify-between mb-6">
                <label className="text-gray-700 font-medium" htmlFor="enableLocationTracking">
                  Enable location tracking
                </label>
                <input
                  type="checkbox"
                  id="enableLocationTracking"
                  name="enableLocationTracking"
                  checked={privacySettings.enableLocationTracking}
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
