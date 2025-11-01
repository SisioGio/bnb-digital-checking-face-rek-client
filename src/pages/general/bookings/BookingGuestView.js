import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useNotification } from "../../../components/Notification";
import apiClient from "../../../utils/apiClient";
import { EditIcon } from "lucide-react";

const BookingGuestView = ({guest,apartment_id}) => {
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);

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

  useEffect(() => {
    const fetchSelfie = async () => {
      if (guest.selfie) {
        const url = await getPresignedUrl(guest.selfie);
        setSelfieUrl(url);
      }
    };
    const fetchFront = async () => {
      if (guest.front) {
        const url = await getPresignedUrl(guest.front);
        setFrontUrl(url);
      }
    }
    const fetchBack = async () => {
      if (guest.back) {
        const url = await getPresignedUrl(guest.back);
        setBackUrl(url);
      }
    }

    fetchSelfie();
    fetchFront();
    fetchBack();
  },[])

  return (

              <div
                key={guest.guest_id}
                className="p-4 bg-white border rounded-xl shadow-sm space-y-1 grid grid-cols-1 md:grid-cols-2 relative hover:shadow-lg transition duration-200"
              >
                <div>
                        <div className="text-md font-medium">
                          {guest.nome} {guest.cognome} <span className="text-sm text-gray-500">({guest.guest_type})</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Document: {guest.tipo_documento} – {guest.numero_documento}
                        </div>
                        <div className="text-sm text-gray-600">Birthdate: {guest.birthdate}</div>
                        <div className="text-sm text-gray-600">
                          Verified:{" "}
                          <span className={guest.verified ? "text-green-600" : "text-red-500"}>
                            {guest.verified ? "Yes" : "No"}
                          </span>
                        </div>
                </div>


                    <div className="flex gap-3">
                     {selfieUrl &&(
                        <img
                        onClick={() => window.open(selfieUrl, "_blank")}
                          src={selfieUrl}
                          alt="Guest Selfie"
                          className="w-24 h-24 object-cover rounded-lg shadow-sm cursor-pointer"
                        />
                      )}

                      {frontUrl &&(
                        <img
                        onClick={() => window.open(frontUrl, "_blank")}
                          src={frontUrl}
                          alt="Front Document"
                          className="w-24 h-24 object-cover rounded-lg shadow-sm cursor-pointer"
                        />
                      )}

                      {backUrl &&(
                        <img
                        onClick={() => window.open(backUrl, "_blank")}
                          src={backUrl}
                          alt="Back Document"
                          className="w-24 h-24 object-cover rounded-lg shadow-sm cursor-pointer"
                        />
                      )}

                      </div>

                      <Link to={`/booking/guest?booking_id=${guest.booking_id}&guest_id=${guest.guest_id}&apartment_id=${apartment_id}`}className="absolute top-2 right-2 p-2 bg-indigo-600 text-white rounded-full shadow hover:bg-white hover:text-indigo-600  transition">
                        <EditIcon/>

                      
                        </Link>

              </div>
           
  );
};

export default BookingGuestView;
