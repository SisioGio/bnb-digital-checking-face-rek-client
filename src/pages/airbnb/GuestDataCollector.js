import React, { useState } from "react";
import axios from "axios";
import { useNotification } from "../../components/Notification";

import tipiOspite from "./data/tipo_alloggiato.json";


import DocumentsUploader from "./DocumentUploader";
import DataReview from "./DataReview";
import IdentityVerification from "./IdentityVerification";
import apiClient from "../../utils/apiClient";
const DocumentUpload = ({
  host_id,
  apartment_id,
  booking_id,
  token,
  fetchGuests,
  loading,
  setLoading,
  setShowForm
}) => {
  const [message, setMessage] = useState("");
  const [newGuestForm, setNewGuestForm] = useState(false);
  const { showNotification } = useNotification();
  const [selectedStep, setSelectedStep] = useState(0);
  const [error,setError] = useState({})
  const [frontDocumentKey,setFrontDocumentKey] = useState(null)
  const [backDocumentKey,setBackDocumentKey] = useState(null)
  const [formData, setFormData] = useState({
    guest_id: null,
    booking_id: booking_id || "",
    tipo_allogiato: "",
    tipo_allogiato_code: "",
    nome: "",
    cognome: "",
    data_nascita: "",
    sesso: "",
    comune_nascita: "",
    comune_nascita_code: "",
    provincia_nascita: "",
    stato_nascita: "",
    stato_nascita_code: "",
    cittadinanza: "",
    cittadinanza_code: "",
    tipo_documento: "",
    tipo_documento_code: "",
    numero_documento: "",
    luogo_rilascio: "",
    luogo_rilascio_code: "",
  });

  const [guestId, setGuestId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError({});

      

      console.log(formData);
      const res = await axios.post(
        "https://3347krtx3j.execute-api.eu-central-1.amazonaws.com/prod/airbnb/api/guest/guest",
        formData,
        
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Reset formData to initial state automatically
      setFormData({
    guest_id: null,
    booking_id: booking_id || "",
    tipo_allogiato: "",
    tipo_allogiato_code: "",
    nome: "",
    cognome: "",
    data_nascita: "",
    sesso: "",
    comune_nascita: "",
    comune_nascita_code: "",
    provincia_nascita: "",
    stato_nascita: "",
    stato_nascita_code: "",
    cittadinanza: "",
    cittadinanza_code: "",
    tipo_documento: "",
    tipo_documento_code: "",
    numero_documento: "",
    luogo_rilascio: "",
    luogo_rilascio_code: "",
    });
      
      showNotification({ text: "🎯 Data successfully saved!", error: false });
      fetchGuests();
      const guestId = res.data["guest_id"];
      setGuestId(guestId);
      if (['16','17','18'].includes(formData.tipo_allogiato_code)){
        setSelectedStep(3);
      } else{

        setNewGuestForm(false)
        showNotification({ text: "🎯 Identity successfully validated!", error: false });
      }
      
      setFormData((prev) => ({ ...prev, name: "", last_name: "" })); 
    } catch (err) {
      showNotification({ text: "⚠️ Something went wrong...", error: true });
      setError(err.response.data)
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPresignedUrl = async (fileName, contentType) => {
    console.log(fileName, contentType);
    const res = await apiClient.post(
      "airbnb/api/guest/uploadurl",
      {
        fileName: fileName,
        apartment_id: apartment_id,
        booking_id: booking_id,
        content_type: contentType,
      }
    );
    return res.data;
  };

  const uploadToS3 = async (file, label) => {
    if (!file) return;

    var uploadResponse = await getPresignedUrl(file.name, file.type);
    console.log(uploadResponse);
    const presignedUrl = uploadResponse.uploadUrl;
    const fileKey = uploadResponse.fileKey;
    const response = await axios.put(presignedUrl, file, {
      headers: { "Content-Type": file.type },
    });

    setMessage((prev) => prev + `${label} uploaded successfully.\n`);
    
    return fileKey;
  };



  const GuestTypeSelection = ()=>{
    const explanations = {
  "16": "Se sei un ospite che partecipa individualmente, senza rappresentare un gruppo o famiglia.",
  "17": "Se sei il capofamiglia che rappresenta e prende decisioni per la famiglia.",
  "18": "Se sei il capo di un gruppo organizzato di persone, come una squadra o comitiva.",
  "19": "Se sei un familiare che fa parte di un nucleo familiare guidato dal capofamiglia.",
  "20": "Se sei un membro di un gruppo ma non il capo né un familiare diretto."
};

    return(

       <div className="mx-auto bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      {/* <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Select Guest Type
      </h2> */}

      <p className="mb-6 text-gray-700 text-center">
        Seleziona la descrizione che meglio rappresenta il tuo ruolo o la tua posizione all’interno
        del gruppo o famiglia.
      </p>

      <ul className="mb-8 space-y-4">
        {tipiOspite.map(({ Codice, Descrizione }) => (
          <li key={Codice} onClick={(e)=>handleChange({target:{name:'tipo_allogiato_code',value:Codice,options:[],selectedIndex:null,text:Descrizione}})} 
          
          className={`p-4 border rounded-md hover:shadow-md transition-shadow cursor-default ${formData.tipo_allogiato_code === Codice ? 'bg-indigo-50 border-indigo-500' : 'border-gray-300'}`}>
            <p className="font-semibold text-indigo-700">{Descrizione}</p>
            <p className="text-gray-600 mt-1 text-sm">{explanations[Codice]}</p>
          </li>
        ))}
      </ul>

      {/* <div className="mb-6">
        <label
          htmlFor="tipo_allogiato_code"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Guest Type
        </label>
        <div className="relative">
          <select
            id="tipo_allogiato_code"
            name="tipo_allogiato_code"
            value={formData.tipo_allogiato_code}
            onChange={handleChange}
            required
            className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              ${error['guest_type_code'] ? 'border-red-500' : 'border-gray-300'}`}
            >
            <option value="">Select a type</option>
            {tipiOspite.map(({ Codice, Descrizione }) => (
              <option key={Codice} value={Codice}>
                {Descrizione}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error['guest_type_code'] && (
          <p className="mt-2 text-sm text-red-600">{error['guest_type_code']}</p>
        )}
      </div> */}

      <button
        type="button"
        onClick={() =>
          ['16', '17', '18'].includes(formData.tipo_allogiato_code)
            ? setSelectedStep(1)
            : setSelectedStep(2)
        }
        disabled={!formData.tipo_allogiato_code}
        className={`w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition
          
          
          ${!formData.tipo_allogiato_code ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Next
      </button>
    </div>
    )
  }



    return (
      <div className=" w-full min-h-screen  bg-opacity-60 top-0 start-0 z-50 mt-0 flex items-center p-2 justify-center" id='data-collector'  style={{marginTop:'0px'}}>

     
      <div className="rounded-2xl  w-full">
        <div className="">

        
         {/* <Title/> */}
       
            {
              selectedStep === 0 &&(
                <GuestTypeSelection/>
              )
            }
          {selectedStep === 1 && (
   

         <DocumentsUploader setSelectedStep={setSelectedStep} formData={formData} setFormData={setFormData} setFrontDocumentKey={setFrontDocumentKey} setBackDocumentKey={setBackDocumentKey} uploadToS3={uploadToS3} token={token}  loading={loading} setLoading={setLoading}/>
          )}

          {selectedStep === 2 && (
          <DataReview formData={formData} handleSubmit={handleSubmit} handleChange={handleChange}  loading={loading} setLoading={setLoading} error={error}/>
          )}

          {selectedStep === 3 && (
          <IdentityVerification setShowForm={setShowForm} uploadToS3={uploadToS3} frontDocumentKey={frontDocumentKey} guestId={guestId} backDocumentKey={backDocumentKey} token={token} setNewGuestForm={setNewGuestForm} showNotification={showNotification} loading={loading} setLoading={setLoading}/>
          )}
        </div>
      </div>
       </div>
    );
  
};

export default DocumentUpload;
