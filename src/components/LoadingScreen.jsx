import React from 'react';
import { Building2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo Container */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl opacity-20 blur animate-pulse"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">लोड हो रहा है...</h2>
          <p className="text-lg text-gray-600">Loading...</p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-sm text-gray-500 space-y-1">
          <p className="font-medium">इंदौर नगर निगम</p>
          <p>Indore Municipal Corporation</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;