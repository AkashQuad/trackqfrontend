import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get userId from localStorage
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      setError("User ID not found in local storage");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/User/${storedUserId}`);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data || "Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="">
      {user ? (
        <h2 className="text-muted-blue font-bold text-2xl">Welcome {(user.username)}!</h2>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default UserDetails;
