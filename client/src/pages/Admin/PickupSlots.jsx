import { FaClock } from "react-icons/fa";

function AdminPickupSlots() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Pickup Slot Management</h1>
        <p className="text-gray-500 mt-2">Create and manage pickup time slots for customers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
          <FaClock size={36} className="text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">No Pickup Slots</h2>
        <p className="text-gray-400 mt-2 max-w-sm">
          Pickup slot management will be available once the slot system is fully implemented.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
          🚧 Slot management coming soon
        </span>
      </div>
    </div>
  );
}

export default AdminPickupSlots;
