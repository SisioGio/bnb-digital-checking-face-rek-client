import React, { useState,useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/general/Home";
import NotFound from "./pages/general/NotFound";

import Register from './pages/account/Register';
import Login from './pages/account/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import { useAuth } from './utils/AuthContext';
import ContactForm from './pages/general/ContactForm';
import AccountConfirmation from './pages/account/AccountConfirmation';
import RequestPasswordReset from './pages/account/RequestPasswordReset';
import ResetPassword from './pages/account/ResetPassword';
import PrivacyStatement from './components/PrivacyStatement';
import GuestsManager from './pages/airbnb/GuestsManager';
import BookingForm from './pages/general/bookings/BookingForm';
import GuestsEditor from './pages/general/bookings/GuestsEditor';


const App = () => {




  return (


     
<Layout>
   
        <Routes>
          <Route path="/" element={<ProtectedRoute path='/'><Home /></ProtectedRoute>} />
           <Route path="/booking" element={<ProtectedRoute path='/booking'><BookingForm /></ProtectedRoute>} />
           <Route path="/booking/guest" element={<ProtectedRoute path='/booking/guest'><GuestsEditor /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/checkin" element={<GuestsManager />} />
          
          <Route path="/confirm" element={<AccountConfirmation />} />
          <Route path='/request-password-reset' element={<RequestPasswordReset/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>
         
         
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>
   
  );
};

export default App;
