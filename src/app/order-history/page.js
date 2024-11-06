// app/order-history/page.js
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import Loader from '../../components/Loader'; // Ensure correct import path

export default function OrderHistory() {
  const { user, token, loading } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null); // State to handle errors
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }

    if (user && token && !loading) {
      const fetchSubscriptions = async () => {
        try {
          const userId = user.sub; // Get user ID from user.sub

          const response = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/subscription/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setSubscriptions(response.data.allSubscriptions);
          setLoadingData(false);
        } catch (error) {
          console.error('Failed to fetch subscriptions:', error);
          setError('Failed to load subscriptions. Please try again later.');
          setLoadingData(false);
        }
      };

      fetchSubscriptions();
    }
  }, [user, token, loading, router]);

  // Show the Loader until authentication and data are loaded
  if (loading || loadingData) {
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
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Order History</h1>
          <p className="text-2xl text-gray-600">View your past subscriptions and payments.</p>
        </section>

        {/* Orders Section */}
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date Paid
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Package Type
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Extension Duration (Days)
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length > 0 ? (
                  subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-t">
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {new Date(subscription.date_paid).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {subscription.package_type}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        ${subscription.amount_paid.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {subscription.extension_duration}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-4 px-6 text-center text-sm text-gray-700" colSpan="4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
