import { FaCalendarAlt, FaClock, FaSave } from "react-icons/fa";

function AdminPickupSlots() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Pickup Schedule Management
        </h1>

        <p className="text-gray-500 mt-2">
          Configure pickup timings for customers.
        </p>
      </div>

      <form className="bg-white rounded-2xl shadow p-8">

        <div className="grid md:grid-cols-2 gap-6">

          {/* Start Date */}

          <div>

            <label className="font-semibold">
              Start Date
            </label>

            <input
              type="date"
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />

          </div>

          {/* End Date */}

          <div>

            <label className="font-semibold">
              End Date
            </label>

            <input
              type="date"
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />

          </div>

          {/* Opening */}

          <div>

            <label className="font-semibold">
              Opening Time
            </label>

            <input
              type="time"
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />

          </div>

          {/* Closing */}

          <div>

            <label className="font-semibold">
              Closing Time
            </label>

            <input
              type="time"
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />

          </div>

          {/* Break Start */}

          <div>

            <label className="font-semibold">
              Break Start
            </label>

            <input
              type="time"
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />

          </div>

          {/* Break End */}

          <div>

            <label className="font-semibold">
              Break End
            </label>

            <input
              type="time"
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />

          </div>

          {/* Interval */}

          <div>

            <label className="font-semibold">
              Slot Interval (Minutes)
            </label>

            <select
              className="w-full mt-2 border rounded-xl px-4 py-3"
            >
              <option>15</option>
              <option>30</option>
              <option>45</option>
              <option>60</option>
            </select>

          </div>

          {/* Capacity */}

          <div>

            <label className="font-semibold">
              Maximum Customers
            </label>

            <input
              type="number"
              placeholder="20"
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />

          </div>

        </div>

        <button
          className="
          mt-8
          bg-green-600
          hover:bg-green-700
          text-white
          px-8
          py-4
          rounded-xl
          flex
          items-center
          gap-3
          "
        >
          <FaSave />

          Generate Pickup Slots

        </button>

      </form>

    </div>
  );
}

export default AdminPickupSlots;