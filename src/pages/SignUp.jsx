import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';
import { motion } from 'framer-motion';
 
const SignUp = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const allowedDomain = '@quadranttechnologies.com';
  
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    });
  }, [password]);
  
  useEffect(() => {
    if (email.trim() !== '' && !email.toLowerCase().endsWith(allowedDomain)) {
      setEmailError(`Only ${allowedDomain} email addresses are allowed`);
    } else {
      setEmailError('');
    }
  }, [email]);
  
  
  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.toLowerCase().endsWith(allowedDomain)) {
      setError(`Only ${allowedDomain} email addresses are allowed for registration`);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await axios.post(`${apiUrl}/api/auth/send-otp`, { email, username });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${apiUrl}/api/auth/verify-otp`, { email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(`${apiUrl}/api/auth/register`, { email, username, otp, password });
      
      setStep(4);
      
      setTimeout(() => {
        navigate('/SignIn');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getPasswordStrength = () => {
    const criteria = Object.values(passwordValidation).filter(Boolean).length;
    if (criteria === 0) return { text: '', color: 'bg-gray-200' };
    if (criteria <= 2) return { text: 'Weak', color: 'bg-red-500' };
    if (criteria <= 4) return { text: 'Medium', color: 'bg-yellow-500' };
    return { text: 'Strong', color: 'bg-green-500' };
  };
  
  const passwordStrength = getPasswordStrength();
 
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#7D31C2]">
          {step === 1 ? 'Enter Your Details' : 
           step === 2 ? 'Verify OTP' : 
           step === 3 ? 'Create Password' :
           'Account Created!'}
        </h2>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded"
          >
            {error}
          </motion.p>
        )}
       
        {step === 1 && (
          <motion.form 
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleEmailSubmit}
          >
            <label className="block text-sm font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
           
            <label className="block text-sm font-semibold text-gray-700 mt-4">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 mt-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Only {allowedDomain} email addresses are allowed</p>
           
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 mt-6 bg-[#FF6F00] text-white font-semibold rounded-lg hover:bg-[#e65c00] transition"
              disabled={loading || emailError !== ''}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : 'Continue'}
            </motion.button>
          </motion.form>
        )}
 
        {step === 2 && (
          <motion.form 
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleOtpSubmit}
          >
            <p className="text-gray-600 mb-4">We've sent a verification code to your email. Please enter it below.</p>
            
            <label className="block text-sm font-semibold text-gray-700">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
              maxLength={6}
            />
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 mt-6 bg-[#FF6F00] text-white font-semibold rounded-lg hover:bg-[#e65c00] transition"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'Verify OTP'}
            </motion.button>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                Back to previous step
              </button>
            </div>
          </motion.form>
        )}
 
        {step === 3 && (
          <motion.form 
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handlePasswordSubmit}
          >
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
            
            {password && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">Password strength:</span>
                  <span className="text-xs font-medium">{passwordStrength.text}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div 
                    className={`h-1.5 rounded-full ${passwordStrength.color}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(Object.values(passwordValidation).filter(Boolean).length / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              </div>
            )}
            
            <div className="mt-3 text-xs text-gray-600">
              <p className="mb-1">Password must include:</p>
              <ul className="space-y-1 pl-2">
                <li className={`flex items-center ${passwordValidation.length ? 'text-green-600' : ''}`}>
                  <span className="mr-1">{passwordValidation.length ? '✓' : '○'}</span> 
                  At least 8 characters
                </li>
                <li className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : ''}`}>
                  <span className="mr-1">{passwordValidation.uppercase ? '✓' : '○'}</span> 
                  One uppercase letter
                </li>
                <li className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : ''}`}>
                  <span className="mr-1">{passwordValidation.lowercase ? '✓' : '○'}</span> 
                  One lowercase letter
                </li>
                <li className={`flex items-center ${passwordValidation.number ? 'text-green-600' : ''}`}>
                  <span className="mr-1">{passwordValidation.number ? '✓' : '○'}</span> 
                  One number
                </li>
                <li className={`flex items-center ${passwordValidation.special ? 'text-green-600' : ''}`}>
                  <span className="mr-1">{passwordValidation.special ? '✓' : '○'}</span> 
                  One special character
                </li>
              </ul>
            </div>
            
            <label className="block text-sm font-semibold text-gray-700 mt-4">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
            
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 mt-6 bg-[#FF6F00] text-white font-semibold rounded-lg hover:bg-[#e65c00] transition"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </motion.button>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                Back to previous step
              </button>
            </div>
          </motion.form>
        )}
        
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: [0.9, 1.1, 1] }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Account Created Successfully!</h3>
            <p className="text-gray-600 mb-4">Redirecting you to login page...</p>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div 
                className="bg-green-500 h-1 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              ></motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
 
export default SignUp;