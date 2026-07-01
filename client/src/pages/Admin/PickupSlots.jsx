import { FaClock } from "react-icons/fa";

function PickupSlots() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Pickup Slots</h1>
        <p className="text-gray-500 mt-2">Configure and manage pickup time slots.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
          <FaClock size={36} className="text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">Slot Management</h2>
        <p className="text-gray-400 mt-2 max-w-md">
          Create time slots for customers to book their grocery pickup. Manage
          capacity limits and availability windows.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
          🚧 Slot management coming soon
        </span>
      </div>
    </div>
  );
}

export default PickupSlots;
