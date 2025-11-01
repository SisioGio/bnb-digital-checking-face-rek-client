import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfDay,
  startOfWeek,
  startOfMonth,
} from 'date-fns';
import apiClient from '../../../utils/apiClient';
import { Link } from 'react-router-dom';
import FullScreenLoader from '../../../utils/Loader'
const VIEWS = [ 'Month'];

const BookingsTable = () => {
  const [bookings, setBookings] = useState({});
  const [view, setView] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const toggleExpand = (apartmentId) => {
    setExpanded((prev) => ({
      ...prev,
      [apartmentId]: !prev[apartmentId],
    }));
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      var params = ''
    
      params = `month=${format(startOfMonth(currentDate), 'M')}&year=${format(startOfMonth(currentDate), 'yyyy')}`;
      
      console.log("Fetching bookings with params:", params);
      
      const response = await apiClient.get(
        `/airbnb/api/private/bookings?${params}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentDate, view]);

  const handleViewChange = (newView) => {
    setView(newView);
    setCurrentDate(new Date()); // reset to today on view change
  };

  const navigate = (direction) => {
    const map = {
      Day: direction === 'next' ? addDays : subDays,
   
      Month: direction === 'next' ? addMonths : subMonths,
    };
    setCurrentDate((prev) => map[view](prev, 1));
  };

  const displayDate = () => {
    if (view === 'Day') return format(currentDate, 'PPP');

    if (view === 'Month') return format(startOfMonth(currentDate), 'LLLL yyyy');
  };

  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2 w-full justify-center">
          <button
            onClick={() => navigate('prev')}
            className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold text-gray-800 flex-grow md:flex-grow-0 text-center">{displayDate()}</span>
          <button
            onClick={() => navigate('next')}
            className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* <div className="flex space-x-2">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v)}
              className={`px-4 py-1.5 rounded-md border text-sm font-medium ${
                view === v
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              {v}
            </button>
          ))}
        </div> */}
      </div>

      {/* Bookings */}
      {Object.keys(bookings).length === 0 ? (
        <p className="text-gray-500">No bookings for this {view.toLowerCase()}.</p>
      ) : (
        Object.keys(bookings).map((apartmentId) => (
          <div key={apartmentId} className="mb-6 border border-gray-200 rounded-xl shadow-sm">
            <button
              className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-t-xl flex justify-between items-center"
              onClick={() => toggleExpand(apartmentId)}
            >
              <span className="font-semibold text-indigo-700">Apartment: {apartmentId}</span>
              <span className="text-sm text-indigo-500">
                {bookings[apartmentId].length} booking(s)
              </span>
            </button>

            {expanded[apartmentId] && (
              <div className="p-4 space-y-4 bg-white rounded-b-xl">
                {bookings[apartmentId].map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="p-4 border border-gray-100 rounded-lg bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                      <div><strong>Guest:</strong> {booking.guest_email}</div>
                      <div><strong>Guests:</strong> {booking.number_of_guests}</div>
                      <div><strong>Check-in:</strong> {format(new Date(booking.checkin), 'PPP')}</div>
                      <div><strong>Check-out:</strong> {format(new Date(booking.checkout), 'PPP')}</div>
                      <div><strong>Booking ID:</strong> {booking.booking_id}</div>
                      <div><strong>PIN:</strong> {booking.pin}</div>
                      <div>
                        <strong>Documents:</strong>{' '}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            booking.doc_uploaded
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.doc_uploaded ? 'Uploaded' : 'Missing'}
                        </span>
                      </div>
                      
                      {booking.notes && (
                        <div className="md:col-span-2">
                          <strong>Notes:</strong> {booking.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
  {/* Check-in Link */}
  <Link
    to={booking.link}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
  >
    📎 Check-in Link
  </Link>

  {/* Open Booking */}
  <Link
    to={`/booking?booking_id=${booking.booking_id}&apartment_id=${booking.apartment_id}`}
    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
  >
    🔍 Open Booking
  </Link>
</div>

                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

<FullScreenLoader loading={loading} />
    </div>
  );
};

export default BookingsTable;
