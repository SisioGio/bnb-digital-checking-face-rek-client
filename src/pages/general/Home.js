import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import {  FaCog, FaDollarSign, FaTools,FaClock,FaExchangeAlt,FaShieldAlt } from 'react-icons/fa';
import ContactForm from './ContactForm';



import FAQSection from './FAQS';
import BackgroundVideo from '../../components/VideoIntro';
import apiClient from '../../utils/apiClient';
import ApartmentManager from './apartments/ApartmentManager';
import BookingManager from './bookings/BookingsManager';


const Home = () => {

  const [apartments,setApartments]= useState([]);
  const [loading,setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('bookings');
  const getApartments = async()=>{

    try{
      setLoading(true);
      const response = await apiClient.get("/airbnb/api/private/apartments")
      setApartments(response.data || []);
      console.log("Apartments fetched successfully:", response.data.apartments);
      
    } catch(error){
      console.error("Error fetching apartments:", error);
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {

    getApartments();
  },[]);
  return (
    <div className="bg-gradient-to-br min-h-screen text-white font-sans  pt-6" id='home'>

    
      <div className='w-full md:w-3/4 lg:w-1/2 mx-auto pt-10 bg-white rounded-lg shadow-lg p-6 min-h-96'>

        <div className='flex flex-col  md:flex-row gap-3 items-center mb-6'>

          <div  onClick={()=>setSelectedTab('bookings')} className='text-xl w-full md:flex-grow gap-6 text-indigo-600 flex border shadow-sm  rounded-md p-3 flex-grow cursor-pointer hover:bg-indigo-50 transition duration-300 ease-in-out'>
            
            <FaClock />
            <p>Bookings</p>
          </div>
          <div  onClick={()=>setSelectedTab('apartments')} className='text-xl w-full md:flex-grow gap-6 text-indigo-600 flex border shadow-sm  rounded-md p-3 flex-grow cursor-pointer hover:bg-indigo-50 transition duration-300 ease-in-out'>
          <FaShieldAlt />
            <p>Apartments</p>
          </div>

        </div>

       

        {selectedTab === 'apartments' && (

          <ApartmentManager apartments={apartments} setApartments={setApartments} getApartments={getApartments}/>
        )}

        {selectedTab ==='bookings' &&(
          <BookingManager/>
        )}
      </div>

    </div>
  );
};

export default Home;