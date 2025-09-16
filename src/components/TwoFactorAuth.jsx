import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, RefreshCw } from 'lucide-react';

const TwoFactorAuth = ({ onSuccess, language = 'hi', onToggleLanguage, translations }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const generatedOTP = '123456'; // Mock OTP

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const enteredOtp = otp.join('');
    
    setTimeout(() => {
      if (enteredOtp === generatedOTP) {
        onSuccess();
      } else {
        alert(translations.invalidOTP);
        setOtp(['', '', '', '', '', '']);
      }
      setLoading(false);
    }, 1500);
  };

  const resendOTP = () => {
    setTimeLeft(120);
    setOtp(['', '', '', '', '', '']);
    alert(translations.newOTPSent);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {translations.twoFactorAuth}
          </h1>
          <h2 className="text-lg font-semibold text-blue-600 mb-1">
            {translations.twoFactorAuthSecondary}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-green-600">
          <div className="text-center mb-6">
            <Smartphone className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {translations.otpVerification}
            </h3>
            <p className="text-sm text-gray-600">
              {translations.enterOTPCode}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                {translations.timeRemaining} <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
              </p>
              {timeLeft > 0 ? (
                <p className="text-xs text-gray-500">
                  {translations.didntReceiveCode.replace('{seconds}', timeLeft)}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center mx-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  {translations.resend}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.some(digit => !digit)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {translations.verifying}
                </div>
              ) : (
                translations.verify
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="bg-blue-50 p-2 rounded">
              {translations.demoOTP} <span className="font-bold text-blue-600">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;