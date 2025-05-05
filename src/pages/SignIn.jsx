import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config';
import {jwtDecode} from 'jwt-decode';
 
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const allowedDomain = '@quadranttechnologies.com';
 
  const navigate = useNavigate();
 
  useEffect(() => {
    if (formData.email.trim() !== '' && !formData.email.toLowerCase().endsWith(allowedDomain)) {
      setEmailError(`Only ${allowedDomain} email addresses are allowed`);
    } else {
      setEmailError('');
    }
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.toLowerCase().endsWith(allowedDomain)) {
      setError(`Only ${allowedDomain} email addresses are allowed for login`);
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/api/Auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
     console.log(response.data);

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        const decodedToken = jwtDecode(token);
        
        const userId = decodedToken.nameid;
        const role = decodedToken.role;
        const UserName=decodedToken.unique_name;
        const email=decodedToken.email;
        
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        localStorage.setItem('UserName',UserName);
        localStorage.setItem('email',email);
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#7D31C2]">Login to Your Account</h2>
        {error && <p className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 mt-1 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Only {allowedDomain} email addresses are allowed</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex justify-between items-center">
            <Link
              to="/forgot-password"
              className="text-sm text-[#7D31C2] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#FF6F00] text-white font-semibold rounded-lg hover:bg-[#e65c00]"
            disabled={loading || emailError !== ''}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default Login;
