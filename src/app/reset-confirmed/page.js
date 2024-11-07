"use client";

import Link from 'next/link';

export default function ResetConfirmed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand via-white to-purple-100">
      <div
        className="bg-white backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://www.edfrica.com/images/icon/ed1.png"
            alt="Logo"
            className="h-20 w-auto"
          />
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Check Your Email
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          A password reset link has been sent to your email. Please follow the instructions to reset your password.
        </p>
        <Link href="/login">
          <button
            className="w-full bg-brand text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  );
}
