import React from "react";
import { motion } from 'framer-motion';
import MainNav from './mainNav';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaArrowUp } from 'react-icons/fa';
import CookieBanner from "./CookieBanner";
import NewsletterPopup from "./NewsLetterPopUp";
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-indigo-800">
    {/* <div id='header' >
    <MainNav/>
    </div> */}
  
  
    <div id='main-container'className='flex-grow bg-indigo-800' style={{'padding-top':"5rem"}} >
      {/* style={{'margin-top':"5rem"}} */}
   {children}
    </div>

    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center py-3">
  <div className="container mx-auto px-6">
    {/* Footer Content */}
    <p className="text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-800 font-semibold ">
      &copy; 2025 <span className="font-semibold">Finbotix</span> developed by Alessio Giovannini Finbotix. All rights reserved.
    </p>
  </div>
    
</footer>


  </div>
  );
};

export default Layout;
