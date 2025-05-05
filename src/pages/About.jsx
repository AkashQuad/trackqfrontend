import React from 'react';
import { GoChecklist } from "react-icons/go";
import { FaClock } from "react-icons/fa";
import { FaRegFlag } from "react-icons/fa";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";



const features = [
  {
    title: 'Task Management',
    description: 'Easily create, assign, and track tasks in one place.',
    icon: <GoChecklist />
  },
  {
    title: 'Time Tracking',
    description: 'Monitor time spent on tasks and improve efficiency.',
    icon: <FaClock />
  },
  {
    title: 'Deadlines & Priorities',
    description: 'Set task priorities and deadlines to stay ahead.',
    icon: <FaRegFlag/>
  },
  {
    title: 'Team Collaboration',
    description: 'Assign tasks, share updates, and boost team productivity.',
    icon: <MdOutlinePeopleOutline />
  }
];

function About() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    const isLoggedIn = localStorage.getItem("token"); 
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  };


  return (
    <div className='w-full h-auto bg-light-bg-1 px-20 py-10'>
      <div className='grid grid-cols-2 gap-10'>
          {/* left */}
        <div className='grid grid-cols-2 pt-5 gap-4 justify-center content-center'>
        {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center transition-transform duration-300 hover:hover:scale-105">
              <div className="mb-4 text-3xl p-3 border border-gray-900 rounded-full transition-transform duration-300 hover:-translate-y-1">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm font-thin">{feature.description}</p>
            </div>
          ))}
        </div>
        

        <div className='flex flex-col justify-center items-start'>
           <h4 className='text-3xl font-semibold'>Smart Task Tracking for Individuals & Teams</h4>
           <p className='font-thin pt-4'>Whether you're managing personal tasks or overseeing a team, our tracking module keeps everything organized. Monitor progress in real time, assign tasks efficiently, and stay on top of every deadline—so nothing falls through the cracks.</p>
           <button 
            onClick={handleExploreClick}
            className='py-2 px-4 border border-dark-coral text-dark-coral rounded mt-4 hover:bg-dark-coral hover:text-white'>
            Explore
            </button>

           <div className='pt-6'>
              <p className='font-thin'>Follow Us</p>
              <div className='flex justify-start items-center gap-3 pt-2'>
                    <a href="https://www.facebook.com/QuadrantTechnologies1" target="_blank" rel="noopener noreferrer">
                      <div className='p-2 rounded-2xl border border-gray-800 hover:bg-gray-800 hover:text-white transition-transform duration-300 hover:-translate-y-1'><FaFacebookF /></div>
                    </a>
                    <a href="https://www.instagram.com/quadranttechnologies1?igsh=MWtpYm55a28zNHdqNQ==" target="_blank" rel="noopener noreferrer">
                      <div className='p-2 rounded-2xl border border-gray-800  hover:bg-gray-800 hover:text-white transition-transform duration-300 hover:-translate-y-1'><FaInstagram /></div>
                    </a>
                    <a href="https://www.linkedin.com/company/quadranttechnologies-1/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                      <div className='p-2 rounded-2xl border border-gray-800  hover:bg-gray-800 hover:text-white transition-transform duration-300 hover:-translate-y-1'><CiLinkedin /></div>
                    </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default About
