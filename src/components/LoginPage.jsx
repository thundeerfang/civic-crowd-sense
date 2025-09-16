import React, { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff, Building2 } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../data/firebase";
import { toast, Toaster } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const LoginPage = ({ onLogin, language = 'hi', onToggleLanguage, translations }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('admin');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.username,
        credentials.password
      );

      const user = userCredential.user;
      toast.success(translations.loginSuccess || 'Login successful!');
      onLogin(user);

    } catch (error) {
      console.error("Login failed:", error);
      toast.error(translations.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onToggleLanguage}
            className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-sm transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            <span className="text-sm font-medium text-gray-700">
              {translations.switchLanguage}
            </span>
          </button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl opacity-20 blur animate-pulse"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {translations.nagarNigam}
          </h1>
          <h2 className="text-lg font-semibold text-blue-600 mb-1">
            {translations.nagarNigamSecondary}
          </h2>
          <p className="text-gray-600">
            {translations.adminDashboard}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {translations.adminLogin}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {language === 'hi' ? 'उपयोगकर्ता प्रकार' : 'User Type'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    userType === 'admin'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'hi' ? 'प्रशासक' : 'Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('user')}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    userType === 'user'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'hi' ? 'उपयोगकर्ता' : 'User'}
                </button>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.username}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={translations.enterUsername}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={translations.enterPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" text={translations.loggingIn} />
              ) : (
                translations.login
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 space-y-1">
          <p>© 2024 {translations.nagarNigam}</p>
          <p>{translations.governmentOfIndia}</p>
        </div>
      </div>
      
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#10b981",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "white",
            },
          },
        }}
      />
    </div>
  );
};

export default LoginPage;