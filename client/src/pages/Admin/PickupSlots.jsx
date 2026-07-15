import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaSave, FaCheckCircle, FaExclamationTriangle, FaUsers } from "react-icons/fa";
import * as slotService from "../../services/slotService";

function AdminPickupSlots() {
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    openingTime: "09:00",
    closingTime: "21:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    interval: "30",
    maxCapacity: "15",
  });

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await slotService.getAllSlots();
      if (res.success) {
        setSlots(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load slots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        openingTime: `${formData.openingTime}:00`,
        closingTime: `${formData.closingTime}:00`,
        breakStartTime: formData.breakStartTime ? `${formData.breakStartTime}:00` : null,
        breakEndTime: formData.breakEndTime ? `${formData.breakEndTime}:00` : null,
        interval: parseInt(formData.interval, 10),
        maxCapacity: parseInt(formData.maxCapacity, 10),
      };

      const res = await slotService.generateSlots(payload);
      if (res.success) {
        setSuccessMsg(`Successfully generated ${res.data.totalSlots} slots!`);
        fetchSlots();
      } else {
        setErrorMsg(res.message || "Failed to generate slots.");
      }
    } catch (err) {
      console.error("Error generating slots:", err);
      setErrorMsg(
        err.response?.data?.message ||
        err.message ||
        "An error occurred while generating slots."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatTime12h = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    let hr = parseInt(hour, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12;
    hr = hr ? hr : 12;
    return `${hr.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Pickup Schedule Management
        </h1>
        <p className="text-gray-500 mt-2">
          Configure pickup timings and bulk generate slots for customers.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-green-600" /> Generate Slots
            </h2>

            {successMsg && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm flex items-center gap-2">
                <FaCheckCircle className="shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
                <FaExclamationTriangle className="shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  required
                  min={formData.startDate}
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block">Opening Time</label>
                  <input
                    type="time"
                    name="openingTime"
                    required
                    value={formData.openingTime}
                    onChange={handleChange}
                    className="w-full mt-1.5 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block">Closing Time</label>
                  <input
                    type="time"
                    name="closingTime"
                    required
                    value={formData.closingTime}
                    onChange={handleChange}
                    className="w-full mt-1.5 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block">Break Start</label>
                  <input
                    type="time"
                    name="breakStartTime"
                    value={formData.breakStartTime}
                    onChange={handleChange}
                    className="w-full mt-1.5 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block">Break End</label>
                  <input
                    type="time"
                    name="breakEndTime"
                    value={formData.breakEndTime}
                    onChange={handleChange}
                    className="w-full mt-1.5 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block">Slot Interval (Minutes)</label>
                <select
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block">Max Customers per Slot</label>
                <input
                  type="number"
                  name="maxCapacity"
                  required
                  min="1"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md shadow-green-100"
            >
              {submitLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FaSave /> Generate Slots
                </>
              )}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>All Active Slots ({slots.length})</span>
              <button
                onClick={fetchSlots}
                className="text-xs text-green-600 hover:underline font-bold"
              >
                Refresh
              </button>
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-green-700 font-medium">Loading slots...</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <FaClock className="mx-auto text-gray-300 text-4xl mb-3 animate-pulse" />
                <p className="text-gray-400 text-sm font-semibold">No slots generated yet</p>
                <p className="text-gray-400 text-xs mt-1">Use the generator form on the left to set up pickup times.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="max-h-[580px] overflow-y-auto pr-1">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Date</th>
                        <th className="pb-3">Timing</th>
                        <th className="pb-3">Bookings</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {slots.map((slot) => {
                        const isFull = slot.bookedCount >= slot.maxCapacity;
                        return (
                          <tr key={slot.id} className="hover:bg-gray-50/40 transition-colors">
                            <td className="py-3.5 pl-2 font-semibold text-gray-800">
                              {new Date(slot.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                weekday: "short",
                              })}
                            </td>
                            <td className="py-3.5 text-gray-600 flex items-center gap-1.5">
                              <FaClock className="text-gray-300 text-xs" />
                              <span>
                                {formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}
                              </span>
                            </td>
                            <td className="py-3.5 text-gray-700">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${isFull ? "text-red-600" : "text-green-700"}`}>
                                  {slot.bookedCount}
                                </span>
                                <span className="text-gray-300">/</span>
                                <span className="text-gray-500">{slot.maxCapacity}</span>
                                <span className="text-xs text-gray-400 font-medium">booked</span>
                              </div>
                            </td>
                            <td className="py-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                slot.isActive
                                  ? "bg-green-50 text-green-700 border border-green-100"
                                  : "bg-gray-50 text-gray-500 border border-gray-100"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${slot.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                                {slot.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPickupSlots;