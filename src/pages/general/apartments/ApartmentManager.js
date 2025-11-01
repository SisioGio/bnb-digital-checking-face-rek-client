import React, { useState } from "react";
import ApartmentList from "./ApartmentList";
import ApartmentForm from "./ApartmentForm";
import { v4 as uuid } from "uuid";
import apiClient from "../../../utils/apiClient";
import { useNotification } from "../../../components/Notification";


const ApartmentManager = ({apartments,setApartments,getApartments}) => {
  const { showNotification } = useNotification();
  const [editingApartment, setEditingApartment] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd =async (data) => {
    const newApartment = {
      ...data,
      apartment_id: uuid(),
      apartment_code: `APT-${uuid().slice(0, 8).toUpperCase()}`,
      created_at: new Date().toISOString()
    };

    try{
        const response = await apiClient.post("/airbnb/api/private/apartment", newApartment);
        console.log("Apartment added successfully:", response.data);
        showNotification({ text: "Apartment added successfully", error:false });
        getApartments()
    } catch(error){
        console.error("Error adding apartment:", error);
        showNotification({ text: "Something went wrong...", error:true });
        return;
    }
    
    setIsFormOpen(false);
  };

  const handleUpdate = async (data) => {
    try{
        const response = await apiClient.put("/airbnb/api/private/apartment/update", data);
        console.log("Apartment updated successfully:", response.data);
        showNotification({ text: "Apartment updated successfully", error:false });
        getApartments()
    } catch(error){
        console.error("Error updating apartment:", error);
        showNotification({ text: "Something went wrong...", error:true });
        return;
    }
    setEditingApartment(null);
    setIsFormOpen(false);
  };

  const handleDelete = async(id) => {
    try{
        const response = await apiClient.delete(`/airbnb/api/private/apartment?apartment_id=${id}`);
        console.log("Apartment deleted successfully:", response.data);
        showNotification({ text: "Apartment deleted successfully", error:false });
        getApartments()
    } catch(error){
        console.error("Error deleting apartment:", error);
        showNotification({ text: "Something went wrong...", error:true });
        return;
    }
    setEditingApartment(null);
    setIsFormOpen(false);
  };

  const handleEdit = (apt) => {
    setEditingApartment(apt);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-700">Apartments</h1>
        <button
          onClick={() => {
            setEditingApartment(null);
            setIsFormOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
        >
          Add Apartment
        </button>
      </div>

      <ApartmentList
        apartments={apartments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <ApartmentForm
          apartment={editingApartment}
          onSave={editingApartment ? handleUpdate : handleAdd}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
export default ApartmentManager;