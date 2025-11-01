import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useNotification } from "../../../components/Notification";
import { motion } from "framer-motion";
import { Camera, UploadCloud, Image } from "lucide-react";
import FullScreenLoader from '../../../utils/Loader'

import apiClient from "../../../utils/apiClient";
import clsx from "clsx";
import stati from "./../../airbnb/data/stati.json"
import comuni from "./../../airbnb/data/comuni.json";
import documenti from "./../../airbnb/data/documenti.json";
import province from "./../../airbnb/data/province.json";
import tipiOspite from "./../../airbnb/data/tipo_alloggiato.json";
import Select from 'react-select';
import { DeleteIcon, FileUp, LucideDelete, Trash, Trash2, Trash2Icon, View } from "lucide-react";
const GuestsEditor = () => {
    const [guest, setGuest] = useState({});
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const booking_id = queryParams.get("booking_id");
    const apartment_id = queryParams.get("apartment_id");
    const guest_id = queryParams.get("guest_id");
    const [error,setError] = useState({})
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotification();
const [formData,setFormData]=useState({
    back: null,
    data_nascita: "",
   

    cittadinanza: "",
    cittadinanza_code: "",

    cognome:"",
    comune_nascita:"",
    comune_nascita_code: "",
   
    data_arrivo: "",
    front: "",
    sesso: "",
    
    giorni: "",
    guest_id: "",
    tipo_allogiato: "",
    tipo_allogiato_code: "",

    
    luogo_rilascio_paese: "",
    luogo_rilascio_paese_code: "",
luogo_rilascio_provincia:'',
luogo_rilascio_comune_code:'',
    luogo_rilascio_comune: "",

    nome: "",
    numero_documento: "",
    provincia_nascita: "",
    selfie: null,
  
    sent: true,
    stato_nascita: null,
    stato_nascita_code: "",
    tipo_documento: "",
    tipo_documento_code: "",
    verified: false,

});
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formData);
  try{
    setLoading(true);
    const res = await apiClient.put("/airbnb/api/private/guest", {
      ...formData,
      booking_id: booking_id,
      guest_id: guest_id,
      apartment_id: apartment_id,
    });
   
// Show notificaiton with icons
    showNotification({ text: "Guest data updated successfully", error: false });
  } catch (error){
    console.log('Error')
    showNotification({text:"Something went wrong...",error:true})
  } finally{
    setLoading(false);
    
  }

}
const handleChange = (e) => {
    const { name, value, options, selectedIndex,text } = e.target;
    console.log(name, value, options, selectedIndex,text);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name.includes("_code") && {
        [name.replace("_code", "")]: options ? options[selectedIndex]?.text || text|| "": text?text:"",
      }),
    }));
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


  const countryOptions =
   stati.map(({ Codice, Descrizione }) => ({
          value: Codice,
          label: Descrizione,
        }))
  
  const provinceOptions =
   province.map((item) => ({
          value: item,
          label: item,
        }))
  
        
  const comuniOptions = comuni
    .filter((comune) => comune.Provincia === formData.luogo_rilascio_provincia)
    .map(({ Codice, Descrizione }) => ({
      value: Codice,
      label: Descrizione,
    }));
  


const deleteFile = async(document_type)=>{
    try{
      setLoading(true);
        console.log("Deleting file:", document_type);
        const response = await apiClient.delete(`/airbnb/api/private/document?guest_id=${guest_id}&booking_id=${booking_id}&document_type=${document_type}`);
        console.log("File deleted successfully:", response.data);
        await retrieveGuestData()
        showNotification({ text: "File deleted successfully", error:false });
        return true;
    } catch(error){
        console.error("Error deleting file:", error);
        showNotification({ text: error.response.data.message || "Something went wrong...", error:true });
 
        return false;
    } finally {
        setLoading(false);
    }
}

const retrieveGuestData =  async()=>{
    try{
        setLoading(true);
        console.log("Retrieving guest data for guest");
        const response = await apiClient.get(`/airbnb/api/private/guest?booking_id=${booking_id}&guest_id=${guest_id}`);
        console.log("Guest data retrieved successfully:", response.data);
        const guestData = response.data
        setFormData({...guestData,
            back: guestData.back || null,
            front: guestData.front || null,
            selfie: guestData.selfie || null,
            nome: guestData.nome || "",
            cognome: guestData.cognome || "",
            sesso: guestData.sesso || "",
            data_arrivo: guestData.data_arrivo || "",
            giorni: guestData.giorni || "",
            stato_nascita_code: guestData.stato_nascita_code || "",
            stato_nascita: guestData.stato_nascita || "",
            comune_nascita_code: guestData.comune_nascita_code || "",
            comune_nascita: guestData.comune_nascita || "",
            provincia_nascita: guestData.provincia_nascita || "",
        })
        
    } catch(error){
        console.error("Error retrieving guest data:", error);
        showNotification({ text: error?.response?.data?.message||"Something went wrong...", error:true });
        return null;
    } finally {
        setLoading(false);
    }
}

const uploadFile = async (e,type) => {
  try {
    setLoading(true);
    const file =  e.target.files[0]
    
    const response =  await apiClient.post("/airbnb/api/private/document/upload",{
        'file_name': file.name,
        'booking_id': booking_id,
        'guest_id': guest_id,
        'apartment_id':apartment_id
    })
    const uploadUrl = response.data.uploadUrl;
    const newKey = response.data.fileKey;
    console.log("Upload URL:", uploadUrl);
    const uploadResponse = await axios.put(uploadUrl,file, {
      headers: { "Content-Type": file.type },
    });
    console.log("File uploaded successfully:", uploadResponse);
    const viewUrl = await getPresignedUrl(newKey)
    setFormData({...formData,[type]:newKey,[type+"Url"]:viewUrl})

    return newKey;
    } catch (error) {
    console.error("Error uploading file:", error);
    showNotification({ text: "Something went wrong while uploading the file...", error:true });
    return null;
    } finally {
    setLoading(false);  
    }
}

const FileUploader = (type)=>{
    
    return(
<motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
        Upload {type.type}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-xl">
          
          <Camera className="w-5 h-5 text-indigo-500" />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => uploadFile(e,type.type)}
            className="text-sm text-gray-600"
          />
        </div>
        
      </motion.div>
    )
    
}

  useState(() => {
   
    if (guest_id){
        console.log("Fetching guest data for guest_id:", guest_id);
        
        retrieveGuestData();
    }
    console.log(guest)
  },[])
  return (

    <div className="bg-gradient-to-br min-h-screen font-sans  pt-6 text-indigo-800" id='home'>

    
      <div className='w-full md:w-3/4 lg:w-1/2 mx-auto pt-10 bg-white rounded-lg shadow-lg p-6 min-h-96'>
            <h2  className="text-2xl font-semibold">Guest Editor # {guest_id}</h2>

 <div className="w-full mx-auto p-6 sm:p-10 rounded-3xl ">
  

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

            <div className="  col-span-2">
        <label htmlFor="tipo_allogiato_code" className="block text-sm font-medium text-gray-700 mb-2">
          Guest Type
        </label>
        <div className="relative">
          <select
            id="tipo_allogiato_code"
            name="tipo_allogiato_code"
            value={formData.tipo_allogiato_code}
            onChange={handleChange}
            required
            className={clsx(
                  "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                  "border-gray-300",
                  error['tipo_allogiato_code'] && "border-red-500"
                )}
          >
            <option value="" className="">Select a type</option>
            {tipiOspite.map(({ Codice, Descrizione }) => (
              <option key={Codice} value={Codice} className="">
                {Descrizione}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {'tipo_allogiato_code' in error && (
          <p className="mt-2 text-sm text-red-600">{error['tipo_allogiato_code']}</p>
        )}
      </div>
          {/* Reusable Field Wrapper */}
          {[
            {
              label: "First Name",
              name: "nome",
              type: "text",
            },
            {
              label: "Last Name",
              name: "cognome",
              type: "text",
            },
            {
              label: "Birthdate",
              name: "data_nascita",
              type: "date",
            },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                id={name}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className={clsx(
                  "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                  "border-gray-300",
                  error[name] && "border-red-500"
                )}
              />
              {error[name] && (
                <small className="text-sm text-red-500 mt-1">
                  {error[name]}
                </small>
              )}
            </div>
          ))}

          {/* Gender */}
          <div className="flex flex-col">
            <label htmlFor="sesso" className="font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="sesso"
              name="sesso"
              value={formData.sesso}
              onChange={handleChange}
              required
              className={clsx(
                "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                "border-gray-300",
                error.sesso && "border-red-500"
              )}
            >
              <option value="">Select Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
            {error.sesso && (
              <small className="text-sm text-red-500 mt-1">
                {error.sesso}
              </small>
            )}
          </div>

          {/* Country of Birth */}
          <div className="flex flex-col">
            <label
              htmlFor="paese_nascita_code"
              className="font-medium text-gray-700 mb-1"
            >
              Country of Birth
            </label>
            <select
              id="paese_nascita_code"
              name="paese_nascita_code"
              value={formData.paese_nascita_code}
              onChange={handleChange}
              required
              className={clsx(
                "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                "border-gray-300",
                (formData.paese_nascita_score < 0.8 ||
                  error.paese_nascita_code) &&
                  "border-red-500"
              )}
            >
              <option value="">Select Country</option>
              {stati.map(({ Codice, Descrizione }) => (
                <option key={Codice} value={Codice}>
                  {Descrizione}
                </option>
              ))}
            </select>
            {error.paese_nascita_code && (
              <small className="text-sm text-red-500 mt-1">
                {error.paese_nascita_code}
              </small>
            )}
          </div>

          {/* Citizenship */}
          <div className="flex flex-col">
            <label
              htmlFor="cittadinanza_code"
              className="font-medium text-gray-700 mb-1"
            >
              Citizenship
            </label>
            <select
              id="cittadinanza_code"
              name="cittadinanza_code"
              value={formData.cittadinanza_code}
              onChange={handleChange}
              required
              className={clsx(
                "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                "border-gray-300",
                (formData.cittadinanza_score < 0.8 ||
                  error.cittadinanza_code) &&
                  "border-red-500"
              )}
            >
              <option value="">Select Citizenship</option>
              {stati.map(({ Codice, Descrizione }) => (
                <option key={Codice} value={Codice}>
                  {Descrizione}
                </option>
              ))}
            </select>
            {error.cittadinanza_code && (
              <small className="text-sm text-red-500 mt-1">
                {error.cittadinanza_code}
              </small>
            )}
          </div>

          {/* Province and City of Birth */}
          {formData.paese_nascita_code === "100000100" && (
            <>
              <div className="flex flex-col">
                <label
                  htmlFor="provincia_nascita"
                  className="font-medium text-gray-700 mb-1"
                >
                  Province of Birth
                </label>
                <select
                  id="provincia_nascita"
                  name="provincia_nascita"
                  value={formData.provincia_nascita}
                  onChange={handleChange}
                  required
                  className={clsx(
                    "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                    "border-gray-300",
                    error.provincia_nascita && "border-red-500"
                  )}
                >
                  <option value="">Select Province</option>
                  {province.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {error.provincia_nascita && (
                  <small className="text-sm text-red-500 mt-1">
                    {error.provincia_nascita}
                  </small>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="comune_nascita_code"
                  className="font-medium text-gray-700 mb-1"
                >
                  City of Birth
                </label>
                <select
                  id="comune_nascita_code"
                  name="comune_nascita_code"
                  value={formData.comune_nascita_code}
                  onChange={handleChange}
                  required
                  className={clsx(
                    "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                    "border-gray-300",
                    (formData.comune_nascita_score < 0.8 ||
                      error.comune_nascita_code) &&
                      "border-red-500"
                  )}
                >
                  <option value="">Select City</option>
                  {comuni
                    .filter(
                      (comune) =>
                        comune.Provincia === formData.provincia_nascita
                    )
                    .map(({ Codice, Descrizione }) => (
                      <option key={Codice} value={Codice}>
                        {Descrizione}
                      </option>
                    ))}
                </select>
                {error.comune_nascita_code && (
                  <small className="text-sm text-red-500 mt-1">
                    {error.comune_nascita_code}
                  </small>
                )}
              </div>
            </>
          )}

          {/* Document Info */}
          {["16", "17", "18"].includes(formData.tipo_allogiato_code) && (
            <>
              <div className="flex flex-col">
                <label
                  htmlFor="tipo_documento_code"
                  className="font-medium text-gray-700 mb-1"
                >
                  Document Type
                </label>
                <select
                  id="tipo_documento_code"
                  name="tipo_documento_code"
                  value={formData.tipo_documento_code}
                  onChange={handleChange}
                  required
                  className={clsx(
                    "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                    "border-gray-300",
                    (formData.tipo_documento_score < 0.9 ||
                      error.tipo_documento_code) &&
                      "border-red-500"
                  )}
                >
                  <option value="">Select Document Type</option>
                  {documenti.map(({ Codice, Descrizione }) => (
                    <option key={Codice} value={Codice}>
                      {Descrizione}
                    </option>
                  ))}
                </select>
                {error.tipo_documento_code && (
                  <small className="text-sm text-red-500 mt-1">
                    {error.tipo_documento_code}
                  </small>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="numero_documento"
                  className="font-medium text-gray-700 mb-1"
                >
                  Document Number
                </label>
                <input
                  id="numero_documento"
                  type="text"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={handleChange}
                  required
                  className={clsx(
                    "w-full p-3 border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                    "border-gray-300",
                    error.numero_documento && "border-red-500"
                  )}
                />
                {error.numero_documento && (
                  <small className="text-sm text-red-500 mt-1">
                    {error.numero_documento}
                  </small>
                )}
              </div>
                
                <div className='col-span-2 grid grid-coll-1 md:grid-cols-3 gap-6'>
 <div className="flex flex-col">
                <label
                  htmlFor="tipo_documento_code"
                  className="font-medium text-gray-700 mb-1"
                >
                  Document Issuing Country
                </label>
                <Select
                                id="luogo_rilascio_paese_code"
                                name="luogo_rilascio_paese_code"
                                options={countryOptions}
                                value={countryOptions.find((opt) => opt.value === formData.luogo_rilascio_paese_code)}
                                onChange={(selected) =>
                                  handleChange({
                                    target: {
                                      name: "luogo_rilascio_paese_code",
                                      value: selected?.value || "",
                                      text: selected?.label || "",
                                    },
                                  })
                                }
                                placeholder="Start typing to search..."
                                classNamePrefix="react-select"
                                className={clsx(
                                  "text-gray-700",
                                  formData.luogo_rilascio_paese_score < 0.9 || error.luogo_rilascio_paese_code
                                    ? "border-red-500"
                                    : ""
                                )}
                              />

                              {error.luogo_rilascio_paese_code && (
                                <small className="text-sm text-red-500 mt-1">
                                  {error.luogo_rilascio_paese_code}
                                </small>
                              )}
              </div>
              {formData.luogo_rilascio_paese_code === "100000100" && (
                          
                        <>
                        <div className="flex flex-col">
                              <label htmlFor="luogo_rilascio_provincia" className="font-medium text-gray-700 mb-1">
                                Document Issuing Province
                              </label>
                    
                              <Select
                                id="luogo_rilascio_provincia"
                                name="luogo_rilascio_provincia"
                                options={provinceOptions}
                                value={provinceOptions.find((opt) => opt.value === formData.luogo_rilascio_provincia)}
                                onChange={(selected) =>
                                  handleChange({
                                    target: {
                                      name: "luogo_rilascio_provincia",
                                      value: selected?.value || "",
                                      text: selected?.label || "",
                                    },
                                  })
                                }
                                placeholder="Start typing to search..."
                                classNamePrefix="react-select"
                                className={clsx(
                                  "text-gray-700",
                                  error.luogo_rilascio_provincia
                                    ? "border-red-500"
                                    : ""
                                )}
                              />

                              {error.luogo_rilascio_provincia && (
                                <small className="text-sm text-red-500 mt-1">
                                  {error.luogo_rilascio_provincia}
                                </small>
                              )}
                      </div>



                       
                      {formData.luogo_rilascio_provincia &&(

<div className="flex flex-col">
                              <label htmlFor="luogo_rilascio_comune_code" className="font-medium text-gray-700 mb-1">
                                Document Issuing Comune
                              </label>
                    
                              <Select
                                id="luogo_rilascio_comune_code"
                                name="luogo_rilascio_comune_code"
                                options={comuniOptions}
                                value={comuniOptions.find((opt) => opt.value === formData.luogo_rilascio_comune_code)}
                                onChange={(selected) =>
                                  handleChange({
                                    target: {
                                      name: "luogo_rilascio_comune_code",
                                      value: selected?.value || "",
                                    },
                                  })
                                }
                                placeholder="Start typing to search..."
                                classNamePrefix="react-select"
                                className={clsx(
                                  "text-gray-700",
                                  formData.luogo_rilascio_comune_score < 0.9 || error.luogo_rilascio_comune_code
                                    ? "border-red-500"
                                    : ""
                                )}
                              />

                              {error.luogo_rilascio_comune_code && (
                                <small className="text-sm text-red-500 mt-1">
                                  {error.luogo_rilascio_comune_code}
                                </small>
                              )}
                      </div>

                      )}
                      
                        
                        </>
                        
                      )} 

                </div>

                            

              
            </>
          )}

          <div key="verified" className="flex flex-col">
  <label htmlFor="verified" className="font-medium text-gray-700 mb-1">
    Verified
  </label>

  <div className="flex items-center gap-3">
    <button
      id="verified"
      type="button"
      onClick={() =>
        setFormData((prev) => ({ ...prev, verified: !prev.verified }))
      }
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        formData.verified ? "bg-green-500" : "bg-gray-300"
      )}
    >
      <span
        className={clsx(
          "inline-block h-4 w-4 transform rounded-full bg-white transition",
          formData.verified ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>

    <span className="text-sm text-gray-600">
      {formData.verified ? "Yes" : "No"}
    </span>
  </div>

  {error["verified"] && (
    <small className="text-sm text-red-500 mt-1">{error["verified"]}</small>
  )}
</div>


          <div className="col-span-2">
            <h3 className="text-xl ">Attachments</h3>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                    {formData.selfieUrl ?(

                        <div className="relative">
                            
                        <img
                        
                          src={formData.selfieUrl}
                          alt="Guest Selfie"
                          className="w-36 h-36 object-cover  shadow-sm cursor-pointer"
                        />
                        <div className="flex">
                            <button type = 'button'  onClick={() => window.open(formData.selfieUrl, "_blank")} className="flex-grow text-white justify-center flex bg-blue-600  p-1"><View/></button>
                     

                    <button type = 'button' onClick={()=>deleteFile('selfie')} className="flex-grow text-white justify-center flex bg-red-600  p-1"><Trash2/></button>
                       </div>
                            </div>
                        
                      ):(
<FileUploader type='selfie'/>
                      )}

                      {formData.frontUrl ?(
                         <div className="relative">
                            
                        <img
                        
                          src={formData.frontUrl}
                          alt="Front Document"
                          className="w-36 h-36 object-cover  shadow-sm cursor-pointer"
                        />
                        <div className="flex">
                    
                    <button type = 'button' onClick={() => window.open(formData.frontUrl, "_blank")} className="flex-grow text-white justify-center flex bg-blue-600  p-1"><View/></button>
                        <button type = 'button' onClick={()=>deleteFile('front')}  className="flex-grow text-white justify-center flex bg-red-600  p-1"><Trash2/></button>
                        </div>
                            </div>
                 ) :(
<FileUploader type='front'/>
                      )}

                      {formData.backUrl ?(
                         <div className="relative">
                            
                        <img
                       
                          src={formData.backUrl}
                          alt="Back Document"
                          className="w-36 h-36 object-cover  shadow-sm cursor-pointer"
                        />
                        <div className="flex">
                            <button type = 'button' onClick={() => window.open(formData.backUrl, "_blank")} className="flex-grow text-white justify-center flex bg-blue-600  p-1"><View/></button>
                     
                    <button type = 'button' onClick={()=>deleteFile('back')}  className="flex-grow text-white justify-center flex bg-red-600  p-1"><Trash2/></button>
                       </div>
                            </div>
                      ):(
<FileUploader type='back'/>
                      )}
            </div>

            
           
          </div>

          {/* Submit Button */}
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl shadow-md transition duration-200"
            >
             
                 Save
            </button>
          </div>
        </form>
    
    </div>

  </div>

  <FullScreenLoader loading={loading} />
  </div>
  );
};

export default GuestsEditor;
