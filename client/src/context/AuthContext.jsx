import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error("Failed to call logout API", err);
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setUser(null);
    }
  };

  const logoutAll = async () => {
    try {
      await API.post("/auth/logout-all");
    } catch (err) {
      console.error("Failed to call logout-all API", err);
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setUser(null);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get("/auth/profile");
        if (res.data.success) {
          setUser(res.data.user);
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          logout();
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (mobile, password) => {
    const res = await API.post("/auth/login", { mobile, password });
    if (res.data.success) {
      sessionStorage.setItem("token", res.data.accessToken);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (name, mobile, password) => {
    const res = await API.post("/auth/register", { name, mobile, password });
    return res.data;
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        logoutAll,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
