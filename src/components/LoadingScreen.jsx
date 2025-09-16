import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        {/* Government Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 animate-pulse">
          <span className="text-white font-bold text-2xl">इं</span>
        </div>
        
        {/* Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">लोड हो रहा है...</h2>
          <p className="text-sm text-gray-600">Loading...</p>
          <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500">
          <p>इंदौर नगर निगम | Indore Municipal Corporation</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;