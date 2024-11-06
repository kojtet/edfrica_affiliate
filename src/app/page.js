// src/app/page.js

'use client';

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  FaUserEdit,
  FaCreditCard,
  FaUsers,
  FaLock,
  FaShieldAlt,
  FaBell,
  FaTrashAlt,
  FaHistory,
  FaGift,
  FaCcVisa,
  FaCcStripe,
  FaMobileAlt,
  FaChevronRight,
  FaShareAlt,
} from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import Loader from "../components/Loader";

export default function Home() {
  const { user,userID, token, loading: authLoading } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  // State variables for affiliate metrics
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [amountEarned, setAmountEarned] = useState(0);
  const [balance, setBalance] = useState(0);
  const [amountWithdrawn, setAmountWithdrawn] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (user && token) {
        try {
          console.log(useAuth())
          const affiliateId = user.sub;
          console.log("Affiliate ID:", affiliateId);
          if (!affiliateId) {
            throw new Error('Affiliate ID is missing.');
          }

          // Fetch users brought by the affiliate
          const usersResponse = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/affiliates/users/affiliate/3bb8e95b-ea88-4951-8a5c-faa1b6991916`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const usersData = usersResponse.data;
          console.log("Users Data:", usersData);
          setTotalCustomers(usersData.length);
          setTotalCommissions(usersData.length); // Assuming one commission per user

          // Fetch total earnings
          const earningsResponse = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/subscription/earnings/3bb8e95b-ea88-4951-8a5c-faa1b6991916`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const earningsData = earningsResponse.data;
          console.log("Earnings Data:", earningsData);
          setAmountEarned(parseFloat(earningsData.total_earnings));

          // Fetch current balance
          const balanceResponse = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/subscription/balance/3bb8e95b-ea88-4951-8a5c-faa1b6991916`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const balanceData = balanceResponse.data;
          console.log("Balance Data:", balanceData);
          setBalance(parseFloat(balanceData.balance));

          // Fetch amount withdrawn
          const withdrawnResponse = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/subscription/affiliate/3bb8e95b-ea88-4951-8a5c-faa1b6991916/total-withdrawn`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const withdrawnData = withdrawnResponse.data;
          console.log("Withdrawn Data:", withdrawnData);
          setAmountWithdrawn(parseFloat(withdrawnData.total_withdrawn));

          setIsDataLoading(false);
        } catch (error) {
          console.error("Failed to fetch affiliate details:", error);
          setError("Failed to load your data. Please try again later.");

          if (error.response && (error.response.status === 401 || error.response.status === 404)) {
            router.push("/login");
          }

          setIsDataLoading(false);
        }
      } else if (!user && !authLoading) {
        console.log("No user and not loading. Redirecting to login.");
        router.push("/login");
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, token, authLoading, router]);

  if (authLoading || isDataLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </>
    );
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
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Welcome back, {user.first_name} {user.last_name}!
          </h1>
          <p className="text-2xl text-gray-600">
            Manage your affiliate account and earnings below.
          </p>
        </section>

        {/* Metrics Section */}
        <div className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Balance */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl text-center">
              <FaCcVisa size={40} className="text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">Balance</h3>
              <p className="text-3xl font-bold text-gray-800">${balance.toFixed(2)}</p>
            </div>

            {/* Amount Earned */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl text-center">
              <FaCreditCard size={40} className="text-green-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">Amount Earned</h3>
              <p className="text-3xl font-bold text-gray-800">${amountEarned.toFixed(2)}</p>
            </div>

            {/* Amount Withdrawn */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl text-center">
              <FaCcStripe size={40} className="text-indigo-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">Amount Withdrawn</h3>
              <p className="text-3xl font-bold text-gray-800">${amountWithdrawn.toFixed(2)}</p>
            </div>

            {/* Total Customers Brought On */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl text-center">
              <FaUsers size={40} className="text-brand mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">Total Customers</h3>
              <p className="text-3xl font-bold text-gray-800">{totalCustomers}</p>
            </div>

            {/* Total Number of Commissions */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl text-center">
              <FaHistory size={40} className="text-gray-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">Total Commissions</h3>
              <p className="text-3xl font-bold text-gray-800">{totalCommissions}</p>
            </div>
          </div>
        </div>

        {/* Action Cards Section */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Request Withdrawal Card */}
            <Link href="/request-withdrawal">
              <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-6 rounded-3xl shadow-2xl h-full transform transition duration-500 hover:scale-105 hover:bg-green-100 cursor-pointer flex items-center justify-center">
                <div className="text-center">
                  <FaCreditCard size={50} className="mx-auto mb-4 text-green-600" />
                  <p className="text-xl font-semibold text-gray-800">Request Withdrawal</p>
                </div>
              </div>
            </Link>

            {/* View Customers Brought Card */}
            <Link href="/view-customers">
              <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-6 rounded-3xl shadow-2xl h-full transform transition duration-500 hover:scale-105 hover:bg-blue-100 cursor-pointer flex items-center justify-center">
                <div className="text-center">
                  <FaUsers size={50} className="mx-auto mb-4 text-blue-600" />
                  <p className="text-xl font-semibold text-gray-800">View Customers</p>
                </div>
              </div>
            </Link>

            {/* Edit Account Card */}
            <Link href="/edit-account">
              <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-6 rounded-3xl shadow-2xl h-full transform transition duration-500 hover:scale-105 hover:bg-brand hover:bg-opacity-20 cursor-pointer flex items-center justify-center">
                <div className="text-center">
                  <FaUserEdit size={50} className="mx-auto mb-4 text-brand" />
                  <p className="text-xl font-semibold text-gray-800">Edit Account</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
