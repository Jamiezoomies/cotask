import React from 'react';

export default function Home() {
  return(
    <div className="flex flex-col h-screen bg-gray-100">
        {/* Navbar */}
        <div className="p-5 bg-white shadow-md">
          <h1 className="text-lg font-bold text-gray-700">CoTask</h1>
        </div>

        {/* Content */}
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">
              Welcome to CoTask
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Your task management simplified.
            </p>
            <div className="space-x-4">
              <button className="px-6 py-2 text-white bg-custom-red rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-custom-red focus:ring-opacity-50">
                Sign In
              </button>
              <button className="px-6 py-2 text-white bg-custom-red rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-custom-red focus:ring-opacity-50">
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-white shadow-md text-center">
          <span className="text-sm text-gray-500">
            © 2024 CoTask. All rights reserved.
          </span>
        </div>
      </div>
  );
}
