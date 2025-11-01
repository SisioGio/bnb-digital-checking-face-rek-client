import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useNotification } from "../../../components/Notification";
import apiClient from "../../../utils/apiClient";
import BookingGuestView from "./BookingGuestView";
import { set } from "date-fns";
import GuestsEditor from "./GuestsEditor";

const BookingForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");
  const apartment_id = queryParams.get("apartment_id");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [booking, setBooking] = useState(null);
  const [guests, setGuests] = useState([]);
  const [editMode, setEditMode] = useState(!booking_id);
  const [loading, setLoading] = useState(true);
  const [editGuest,setEditGuest]  = useState(null)
  const [exportFileUrl,setExportFileUrl] = useState(null);  
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const res = await apiClient.get(
          `/airbnb/api/private/booking?booking_id=${booking_id}&apartment_id=${apartment_id}`
        );
        setBooking(res.data);

        
      } catch (err) {
        showNotification({ text: "Failed to fetch booking", error: true });
      } finally {
        setLoading(false);
      }
    };

    if (booking_id && apartment_id) {
      fetchBookingData();
    } else {
      setLoading(false);
    }
  }, [booking_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (booking_id) {
        await apiClient.put(`/airbnb/api/private/booking`, booking);
        showNotification({ text: "Booking updated" });
      } else {
        await apiClient.post(`/airbnb/api/private/booking`, booking);
        showNotification({ text: "Booking created" });
        navigate("/bookings");
      }
      setEditMode(false);
    } catch (err) {
      showNotification({ text: "Failed to save booking", error: true });
    }
  };

  const getPresignedUrl = async(fileKey)=>{
    try{
      const response = await apiClient.get(`/airbnb/api/private/document?file_key=${fileKey}`);
      console.log(response.data)
      return response.data.url;
    } catch(error){
      console.log(error)
      return null
    }
  }

  const downloadExportFile = async () => {
    if (booking.export_file ) {

      const url = await getPresignedUrl(booking.export_file);
      console.log("Export file URL:", url);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = booking.export_file.split("/").pop(); // Use file name from path
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
       

    }
  }
}


  const generate_export_file = async ()=>{
    try{
      const response = await apiClient.post(`/airbnb/api/private/guests/submit`, { booking_id: booking.booking_id,apartment_id: booking.apartment_id });
      console.log("Export file generated:", response.data);
      showNotification({ text: "Export file generated successfully", error: false });
      // Update booking with response.data.file_key
      setBooking((prev) => ({ ...prev, export_file: response.data.file_key }));
      const url = await getPresignedUrl(response.data.file_key);
      setExportFileUrl(url);

    } catch(error){
      console.error("Error generating export file:", error);
      showNotification({ text: "Failed to generate export file", error: true });
    }
  }
  // useEffect(() => {
  //   console.log("Booking data updated:", booking);

  //   if( booking && booking.export_file){
  //     console.log("Fetching export file for booking:", booking.export_file);
  //     const fetchExportFile = async () => {
  //       const url = await getPresignedUrl(booking.export_file);
  //       console.log("Export file URL:", url);
  //       if (url) {
  //         setExportFileUrl(url);
  //       }
  //     };
  //     fetchExportFile();
  //   }
  // },[booking]);

  if (loading) return <div className="p-4 text-gray-600">Loading booking...</div>;

  return (

    <div className="bg-gradient-to-br min-h-screen font-sans  pt-6 text-indigo-800" id='home'>

    {editGuest ? (

      <GuestsEditor guest={editGuest}/>
    ):(
<div className='w-full md:w-3/4 lg:w-1/2 mx-auto pt-10 bg-white rounded-lg shadow-lg p-6 min-h-96'>
   
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-6">
        <h1 className="text-2xl font-semibold">
          {booking_id ? `Booking #${booking_id}` : "New Booking"}
        </h1>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 text-sm rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition"
          >
            Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div>
          <label className="block text-sm font-medium mb-1">Guest Email</label>
          <input
            type="email"
            name="guest_email"
            value={booking?.guest_email || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full form-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Apartment ID</label>
          <input
            name="apartment_id"
            value={booking?.apartment_id || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full form-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check-in</label>
          <input
            type="date"
            name="checkin"
            value={booking?.checkin || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full form-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Number of Guests</label>
          <input
            type="number"
            name="number_of_guests"
            value={booking?.number_of_guests || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full form-input"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={booking?.notes || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="w-full form-textarea"
            rows={4}
          />
        </div>
      </div>

      {editMode && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            {booking_id ? "Update Booking" : "Create Booking"}
          </button>
        </div>
      )}

      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold">Actions</h2>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
        <btn className="p-3 bg-green-600 rounded-md block text-white cursor-pointer  text-center md:w-" onClick={()=>generate_export_file()}>Generate Export File</btn>

        {booking?.export_file &&(
          <a
            onClick={()=>downloadExportFile()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-blue-600 rounded-md block text-white cursor-pointer  text-center"
          >
            Download Export File
          </a>
        )}

        {booking?.token &&(
          <Link
            to={`/checkin?token=${booking.token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-indigo-600 rounded-md block text-white cursor-pointer  text-center"
          >
            Go to Check-in Page
          </Link>
        )}


        </div>
  
      </div>

      {/* Guests Section */}
      <div className="mt-8 space-y-6">
        <h2  className="text-2xl font-semibold">Guests</h2>
        {booking.guests.length === 0 ? (
          <p className="text-gray-500">No guest data available.</p>
        ) : (
          <div className="grid grid-cols-1  gap-4 text-gray-700">
            {booking.guests.map((guest) => (
              <BookingGuestView guest={guest} setEditGuest={setEditGuest} apartment_id={booking.apartment_id}/>
            ))}
          </div>
        )}
      </div>

      </div>
    )}
      
    </div>
  );
};

export default BookingForm;
