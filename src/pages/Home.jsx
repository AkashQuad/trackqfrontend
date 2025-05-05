import React from 'react';
import About from './About';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  const handleTryForFreeClick = () => {
    const isLoggedIn = localStorage.getItem("token"); 
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  };

  return (
    <>
        <div className='w-full h-auto p-20 flex flex-col justify-center items-center gap-6 bg-light-bg-2'>
        <h1>
            <span className='bg-gradient-to-tr from-custom-pink to-custom-yellow text-5xl font-bold bg-clip-text text-transparent '>
            Stay on Track, Stay in Control!
            </span>
         </h1>
            <p>Effortlessly monitor, manage, and optimize your progress—all in one place.</p>
              <button 
              onClick={handleTryForFreeClick}
              className='px-4 py-2 bg-muted-blue rounded-lg text-white transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-400/50'>
                Let's Go...
              </button>
        </div>

        <About />
    
    </>
  )
}

export default Home
