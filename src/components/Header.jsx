
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
 
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const role = localStorage.getItem('role');
  const managerId = localStorage.getItem("userId");
 
  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };
 
  const handleLogoClick = () => {
    navigate('/'); 
  };
 
  return (
    <nav className='flex justify-between items-baseline p-4 rounded-2xl'>
      <div>
        <button
          onClick={handleLogoClick}
          className='bg-muted-blue px-4 py-2 rounded-xl font-[Caveat] font-bold text-white text-xl hover:opacity-90 transition'
        >
          TrackQ
        </button>
      </div>
 
     
      <ul className='flex justify-center items-baseline gap-8'>
       
      </ul>
 
   
      <ul className='flex justify-center items-baseline gap-3'>
        {!role ? (
       
          <>
            <li>
              <NavLink
                to="/signup"
                className="px-4 py-2 text-sm border border-[#7D31C2] text-[#7D31C2] rounded-3xl hover:bg-[#7D31C2] hover:text-white transition"
              >
                Sign Up
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/signin"
                className="px-4 py-2 text-sm border border-[#FF6F00] text-[#FF6F00] rounded-3xl hover:bg-[#FF6F00] hover:text-white transition"
              >
                Sign In
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-3xl hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
 
export default Header;
 