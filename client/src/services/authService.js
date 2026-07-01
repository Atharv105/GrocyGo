import API from "./api";

/**
 * Auth service — centralised API calls for authentication.
 * Uses the shared Axios instance (with auth token interceptor).
 */

/** Login with mobile + password. Returns { success, token, user } */
export const loginUser = (mobile, password) =>
  API.post("/auth/login", { mobile, password }).then((r) => r.data);

/** Register a new user. Returns { success, message } */
export const registerUser = (name, mobile, password) =>
  API.post("/auth/register", { name, mobile, password }).then((r) => r.data);

/** Get the currently authenticated user's profile. */
export const getProfile = () =>
  API.get("/auth/profile").then((r) => r.data);

/** Update the currently authenticated user's profile. */
export const updateProfile = (name, mobile) =>
  API.put("/auth/profile", { name, mobile }).then((r) => r.data);
