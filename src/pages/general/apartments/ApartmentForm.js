import { useState, useEffect } from "react";

export default function ApartmentForm({ apartment, onSave, onCancel }) {
  const [form, setForm] = useState( {
    street: "",
    city: "",
    country: "",
    postcode: "",
    room_no: ""
  });

  useEffect(() => {
    if (apartment) setForm(apartment);
    console.log(apartment)
  }, [apartment]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.country) return;
    onSave({ ...apartment, ...form });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 border rounded-xl bg-white shadow-md"
    >
      <h2 className="text-lg font-semibold text-indigo-700 mb-4">
        {apartment ? "Edit Apartment" : "Add Apartment"}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <input
            key={"apartment_id"}
            name={"apartment_id"}
            placeholder={"apartment_id".replace("_", " ").toUpperCase()}
            value={form["apartment_id"] || ""}
            disabled={true}
            onChange={handleChange}
            className="border p-2 rounded-lg text-gray-600"
          />
        {["street", "city", "country", "postcode", "room_no"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={form[field] || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg text-gray-600"
          />
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
