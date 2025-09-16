import React, { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../data/firebase"; // adjust path
import {toast,Toaster} from 'react-hot-toast';

const LoginPage = ({ onLogin, language = 'hi', onToggleLanguage, translations }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('admin');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Firebase login (username = email here)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.username,
        credentials.password
      );

      const user = userCredential.user;
      toast.success(translations.loginSuccess);
      // Call parent callback
      onLogin(user);

    } catch (error) {
      console.error("Login failed:", error);
      toast.error(translations.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onToggleLanguage}
            className="flex items-center space-x-2 px-3 py-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-colors border"
          >
            <span className="text-sm font-medium text-gray-700">
              {translations.switchLanguage}
            </span>
          </button>
        </div>
        
        {/* Government Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {translations.nagarNigam}
          </h1>
          <h2 className="text-lg font-semibold text-blue-600 mb-1">
            {translations.nagarNigamSecondary}
          </h2>
          <p className="text-sm text-gray-600">
            {translations.adminDashboard}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-blue-600">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            {translations.adminLogin}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'उपयोगकर्ता प्रकार' : 'User Type'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    userType === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'hi' ? 'प्रशासक' : 'Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('user')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    userType === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'hi' ? 'उपयोगकर्ता' : 'User'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.username}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={translations.enterUsername}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={translations.enterPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {translations.loggingIn}
                </div>
              ) : (
                translations.login
              )}
            </button>
          </form>

          
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2024 {translations.nagarNigam} | All Rights Reserved</p>
          <p className="mt-1">{translations.governmentOfIndia}</p>
        </div>
      </div>
         <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#4ade80",
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