// src/app/view-customers/page.js

'use client';

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Loader from "../../components/Loader";
import { FaUsers } from "react-icons/fa";

export default function ViewCustomers() {
  const { user, userID, token, loading: authLoading } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(""); // For search
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const itemsPerPage = 10; // Show 10 users per page

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

          // Fetch customers brought by the affiliate
          const customersResponse = await axios.get(
            `https://edfrica-backend-supabase.onrender.com/api/affiliates/users/affiliate/${affiliateId}`,
            { headers }
          );
          const customersData = customersResponse.data;
          setCustomers(customersData);

          setIsDataLoading(false);
        } catch (error) {
          console.error("Failed to fetch customers:", error);
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

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-white via-purple-50 to-brand min-h-screen pb-12">
        {/* Page Header */}
        <section className="text-center py-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Your Referred Customers
          </h1>
          <p className="text-xl text-gray-600">
            View the list of customers you have brought on.
          </p>
        </section>

        {/* Search Bar */}
        <div className="container mx-auto px-4 mb-6">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by email"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {/* Customers List */}
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl">
            {currentCustomers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 tracking-wider">
                          Phone Number
                        </th>
                        <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 tracking-wider">
                          Registration Date
                        </th>
                        <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 tracking-wider">
                          Expiration Time
                        </th>
                        <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 tracking-wider">
                          Active
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCustomers.map((customer) => (
                        <tr key={customer.uid}>
                          <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                            {customer.first_name} {customer.last_name}
                          </td>
                          <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                            {customer.email}
                          </td>
                          <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                            {customer.phone_number || "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                            {customer.expiration_time
                              ? new Date(customer.expiration_time).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                            {customer.active ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-brand text-white hover:bg-brand-dark"
                    }`}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages || totalPages === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-brand text-white hover:bg-brand-dark"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-lg text-gray-600">
                No customers found.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
