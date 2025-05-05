import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, About, Dashboard, SignIn, SignUp, Header, Footer, UserProfile, ListUsers, ForgotPassword } from './Links';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/Admin-Components/AdminDashboard';
import ManagerDashboard from './components/Manager-Components/ManagerDashboard';
import UserDashboard from './components/User-Components/UserDashboard';
 
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
 
        {/* Protected routes for manager */}
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute role="Manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/manager-dashboard/:userId"
          element={
            <ProtectedRoute role="Manager">
              <UserProfile />
            </ProtectedRoute>
          }
        />
 
        {/* Protected routes for admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
 
        {/* Protected routes for user */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="User">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
 
        {/* Catch-all route for unmatched URLs */}
        <Route
          path="*"
          element={
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
              <p className="mt-4">The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
 
export default App;
 