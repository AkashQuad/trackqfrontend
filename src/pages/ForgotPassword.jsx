import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';
 
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
 
  // Improved email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
 
  // Validate OTP (6 digits only)
  const validateOTP = (otp) => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  };
 
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
   
    try {
      
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
 
      // Send OTP
      const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
     
      
      setStep(2);
     
   
      window.alert('OTP has been sent to your email');
    } catch (err) {

      if (err.response) {
        switch (err.response.status) {
          case 404:
            setError('Email not registered. Please check your email.');
            break;
          case 429:
            setError('Too many attempts. Please try again later.');
            break;
          default:
            setError(err.response.data.message || 'Failed to send OTP. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };
 
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
   
    try {
      
      if (!validateOTP(otp)) {
        setError('OTP must be 6 digits');
        setLoading(false);
        return;
      }
 
    
      await axios.post(`${apiUrl}/api/auth/verify-otp`, { email, otp });
     
      
      setStep(3);
    } catch (err) {
   
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Invalid OTP. Please try again.');
            break;
          default:
            setError(err.response.data.message || 'OTP verification failed.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };
 
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
   
    try {
      
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
     
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters long, include a letter, a number, and a special character');
        setLoading(false);
        return;
      }
 

      await axios.post(`${apiUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword: password
      });
     
     
      window.alert('Password reset successfully! You can now log in.');
      navigate('/signin');
    } catch (err) {
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Invalid password. Please try a different password.');
            break;
          default:
            setError(err.response.data.message || 'Failed to reset password.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#7D31C2]">
          {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Create New Password'}
        </h2>
       
       
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
       
       
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Enter your registered email to receive OTP
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D31C2]"
              />
            </div>
           
            <button
              type="submit"
              className="w-full py-2 bg-[#FF6F00] text-white font-semibold rounded-lg hover:bg-[#e65c00] transition duration-300"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
 
        
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                Enter 6-digit OTP sent to {email}
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D31C2]"
              />
            </div>
           
            <button
              type="submit"
              className="w-full py-2 bg-[#FF6F00] text-white font-semibold rounded-lg hover:bg-[#e65c00] transition duration-300"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
           
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 mt-2 border border-[#7D31C2] text-[#7D31C2] font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Change Email
            </button>
          </form>
        )}
 
        
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Create New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D31C2]"
              />
              <p className="text-xs text-gray-600 mt-1">
                Password must be at least 8 characters, include a letter, number, and special character
              </p>
            </div>
           
            <button
              type="submit"
              className="w-full py-2 bg-[#FF6F00] text-white font-semibold rounded-lg hover:bg-[#e65c00] transition duration-300"
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
 
export default ForgotPassword;
 