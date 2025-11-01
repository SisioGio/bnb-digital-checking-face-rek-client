export default function ApartmentList({ apartments, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {apartments.map((apt) => (
        <div
          key={apt.apartment_id}
          className="p-4 border rounded-xl bg-indigo-50 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-indigo-700">
              {apt.street}, {apt.city}, {apt.country}
            </p>
            <p className="text-sm text-gray-600">Postcode: {apt.postcode}</p>
            <p className="text-sm text-gray-600">Code: {apt.apartment_code}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(apt)}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(apt.apartment_id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
