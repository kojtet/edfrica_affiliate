// app/refer-friend/page.js
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Link from 'next/link';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaEnvelope, 
  FaClipboard, 
  FaArrowLeft // Added FaArrowLeft here
} from 'react-icons/fa';

export default function ReferFriend() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const referralCode = 'REF123456'; // Dummy referral code

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const shareMessage = `Join Edfrica Premium using my referral code: ${referralCode} and earn exciting gifts!`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=https://edfrica.com&quote=${encodeURIComponent(shareMessage)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://edfrica.com&summary=${encodeURIComponent(shareMessage)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`,
    email: `mailto:?subject=Join Edfrica Premium&body=${encodeURIComponent(shareMessage)}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
      .then(() => {
        alert('Referral code copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  if (loading ) {
    return <Loader />;
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
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Refer a Friend</h1>
          <p className="text-2xl text-gray-600">Share your referral code and earn gifts!</p>
        </section>

        {/* Referral Code Section */}
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center">
            <p className="text-lg text-gray-700 mb-4">Your Referral Code:</p>
            <div className="flex justify-center items-center mb-6">
              <span className="text-2xl font-semibold text-brand mr-2">{referralCode}</span>
              <button onClick={copyToClipboard} className="text-gray-600 hover:text-gray-800">
                <FaClipboard size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Share your code below:</p>
            <div className="flex justify-around">
              <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <FaFacebook size={30} />
              </a>
              <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                <FaTwitter size={30} />
              </a>
              <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                <FaLinkedin size={30} />
              </a>
              <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                <FaWhatsapp size={30} />
              </a>
              <a href={shareUrls.email} className="text-gray-600 hover:text-gray-800">
                <FaEnvelope size={30} />
              </a>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="container mx-auto px-4 mt-8 text-center">
          <Link href="/">
            <button className="flex items-center justify-center mx-auto px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark">
              <FaArrowLeft className="mr-2" />
              Back to Home
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
