import API from "./api";

/**
 * Slot service — centralised API calls for pickup slots.
 * Admin-only mutations (create, generate, view all) require a valid admin token
 * which is automatically attached by the Axios interceptor in api.js.
 */

/** Admin: Create a single slot */
export const createSlot = (slotData) =>
  API.post("/slots", slotData).then((r) => r.data);

/** Admin: Get all slots (history/management) */
export const getAllSlots = () =>
  API.get("/slots").then((r) => r.data);

/** Admin: Generate slot schedule bulk */
export const generateSlots = (data) =>
  API.post("/slots/generate", data).then((r) => r.data);

/** Customer/Admin: Get available slots by date (YYYY-MM-DD) */
export const getAvailableSlots = (date) =>
  API.get("/slots/available", { params: { date } }).then((r) => r.data);
