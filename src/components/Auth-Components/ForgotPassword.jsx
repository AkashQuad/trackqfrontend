import React, { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleForgotPassword = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axios.post(
        `${apiUrl}/api/auth/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage("OTP sent to your email.");
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP.");
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      setMessage("OTP verified. Now set your new password.");
      setStep(3); // Move to password reset step
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    }
    setLoading(false);
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axios.post(
        `${apiUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage("Password reset successfully. You can now login.");
      setStep(1); // Go back to the first step (email input)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 text-center">
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold">Forgot Password?</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-md mt-2 w-full focus:outline-none focus:ring-2 focus:ring-muted-blue"
          />
          <button
            onClick={handleForgotPassword}
            className="bg-muted-blue text-white px-4 py-2 rounded-md mt-2 w-full"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold">Verify OTP</h3>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border px-4 py-2 rounded-md mt-2 w-ful focus:outline-none focus:ring-2 focus:ring-dark-coral"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-dark-coral text-white px-4 py-2 rounded-md mt-2 w-full"
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold">Reset Password</h3>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border px-4 py-2 rounded-md mt-2 w-full focus:outline-none focus:ring-2 focus:ring-muted-blue"
          />
          <button
            onClick={handleResetPassword}
            className="bg-mued-blue text-white px-4 py-2 rounded-md mt-2 w-full"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </div>
      )}

      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ForgotPassword;