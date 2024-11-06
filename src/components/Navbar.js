// components/Navbar.js
'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext'; // Correct import path
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container flex items-center justify-between h-24 mx-auto px-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <img
              src="https://www.edfrica.com/images/icon/ed1.png"
              alt="Logo"
              className="h-20 w-auto sm:h-24 md:h-28" // Increased logo size
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link href="/support" className="text-gray-800 hover:text-blue-600">
            Support
          </Link>
          <Link href="/download" className="text-gray-800 hover:text-blue-600">
            Download
          </Link>

          {/* Social Media Icons */}
          <div className="flex items-center space-x-4">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-red-600"
            >
              <FaYoutube size={24} /> {/* Increased icon size for better visibility */}
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-pink-500"
            >
              <FaInstagram size={24} /> {/* Increased icon size for better visibility */}
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-blue-500"
            >
              <FaTwitter size={24} /> {/* Increased icon size for better visibility */}
            </a>
          </div>

          {/* Authentication Buttons */}
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
