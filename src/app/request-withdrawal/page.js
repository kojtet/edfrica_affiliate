// src/app/request-withdrawal/page.js

'use client';

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Loader from "../../components/Loader";
import {
  FaMoneyCheckAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";

export default function RequestWithdrawal() {
  const { user, userID, token, loading: authLoading } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [error, setError] = useState(null);

  const [modeOfPayment, setModeOfPayment] = useState("Bank Transfer");
  const [amount, setAmount] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(null);

  // Additional state variables
  const [accountNumber, setAccountNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState("MTN Mobile Money");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (user && userID && token) {
        try {
          const affiliateId = userID;

          if (!affiliateId) {
            throw new Error('Affiliate ID is missing.');
          }

          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          };

          // Fetch previous withdrawal requests
          const requestsResponse = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/withdrawals/affiliate/${affiliateId}`,
            { headers }
          );
          const requestsData = requestsResponse.data.withdrawalRequests;
          setWithdrawalRequests(requestsData);

          setIsDataLoading(false);
        } catch (error) {
          console.error("Failed to fetch withdrawal requests:", error);
          setError("Failed to load your data. Please try again later.");

          if (error.response && (error.response.status === 401 || error.response.status === 404)) {
            router.push("/login");
          }

          setIsDataLoading(false);
        }
      } else if (!authLoading) {
        console.log("No user and not loading. Redirecting to login.");
        router.push("/login");
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, userID, token, authLoading, router]);

  const handleRequestWithdrawal = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestError(null);
    setRequestSuccess(null);

    try {
      const affiliateId = userID;

      if (!affiliateId) {
        throw new Error('Affiliate ID is missing.');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const requestBody = {
        affiliate_id: affiliateId,
        modeOfPayment: modeOfPayment,
        amount: parseFloat(amount),
      };

      // Add additional fields based on mode of payment
      if (modeOfPayment === "Bank Transfer") {
        requestBody.account_number = accountNumber;
        requestBody.branch = branch;
      } else if (modeOfPayment === "Mobile Money") {
        requestBody.mobile_money_provider = mobileMoneyProvider;
        requestBody.phone_number = phoneNumber;
      }

      await axios.post(
        `https://edfrica-backend-supabase.onrender.com/api/withdrawals/request`,
        requestBody,
        { headers }
      );

      setRequestSuccess("Withdrawal request submitted successfully.");

      // Refresh the withdrawal requests list
      const requestsResponse = await axios.get(
        `https://edfrica-backend-supabase.onrender.com/api/withdrawals/affiliate/${affiliateId}`,
        { headers }
      );
      const requestsData = requestsResponse.data.withdrawalRequests;
      setWithdrawalRequests(requestsData);

      // Reset form fields
      setAmount("");
      setAccountNumber("");
      setBranch("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Failed to submit withdrawal request:", error);
      setRequestError("Failed to submit your request. Please try again later.");
    } finally {
      setRequestLoading(false);
    }
  };

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
    router.push("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-white via-purple-50 to-brand min-h-screen pb-12">
        {/* Page Header */}
        <section className="text-center py-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Request Withdrawal
          </h1>
          <p className="text-xl text-gray-600">
            Submit a withdrawal request and view your previous requests.
          </p>
        </section>

        {/* Withdrawal Request Form */}
        <div className="container mx-auto px-4 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Submit a Withdrawal Request
            </h2>
            <form onSubmit={handleRequestWithdrawal} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Mode of Payment
                </label>
                <select
                  value={modeOfPayment}
                  onChange={(e) => setModeOfPayment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {modeOfPayment === "Bank Transfer" && (
                <>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </>
              )}

              {modeOfPayment === "Mobile Money" && (
                <>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Mobile Money Provider
                    </label>
                    <select
                      value={mobileMoneyProvider}
                      onChange={(e) => setMobileMoneyProvider(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Telecel Cash">Telecel Cash</option>
                      <option value="Airtel/Tigo Cash">Airtel/Tigo Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Amount (GH₵)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              {requestError && (
                <p className="text-red-500">{requestError}</p>
              )}
              {requestSuccess && (
                <p className="text-green-500">{requestSuccess}</p>
              )}
              <button
                type="submit"
                className="w-full bg-brand text-white py-3 rounded-md text-lg font-semibold hover:bg-brand-dark transition-colors"
                disabled={requestLoading}
              >
                {requestLoading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </div>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Previous Withdrawal Requests */}
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Your Withdrawal Requests
            </h2>
            {withdrawalRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-lg leading-4 text-gray-700 tracking-wider">
                        Date Requested
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-lg leading-4 text-gray-700 tracking-wider">
                        Amount (GH₵)
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-lg leading-4 text-gray-700 tracking-wider">
                        Mode of Payment
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-lg leading-4 text-gray-700 tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {new Date(request.requested_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          GH₵{request.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {request.mode_of_payment}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {request.status === "completed" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <FaCheckCircle className="mr-1" /> Completed
                            </span>
                          ) : request.status === "pending" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              <FaSpinner className="mr-1 animate-spin" /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              <FaTimesCircle className="mr-1" /> Failed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-lg text-gray-600">
                You have not made any withdrawal requests yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
