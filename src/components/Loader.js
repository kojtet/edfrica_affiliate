// components/Loader.js
'use client';

import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="flex space-x-4">
        <div className="w-6 h-6 bg-indigo-600 rounded animate-loader1"></div>
        <div className="w-6 h-6 bg-indigo-600 rounded animate-loader2"></div>
        <div className="w-6 h-6 bg-indigo-600 rounded animate-loader3"></div>
      </div>
    </div>
  );
}
