import React from 'react';
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    const isLoggedIn = localStorage.getItem("token"); 

    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className='flex flex-col justify-start items-center gap-4 p-6 bg-muted-blue text-white text-center'>
        <h3 className='text-2xl font-semibold'>Stay Organized, Stay Ahead! <br /> Track your tasks, manage your time, and accomplish more—every day.</h3>
        <button 
        onClick = {handleGetStartedClick}
        className='px-4 py-2 rounded-xl bg-dark-coral transition-all duration-300 hover:opacity-80 hover:backdrop-blur-sm'>
          Get Started
        </button>
        <ul className='flex gap-4'>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
        </ul>
        <p className='mt-4 text-gray-200 font-extralight'>&copy; 2025 TrackQ Inc. All rights reserved</p>
    </div>
  )
}

export default Footer
