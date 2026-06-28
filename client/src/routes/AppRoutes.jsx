import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/Layout/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import MyProfile from "../pages/Profile/MyProfile";
import EditProfile from "../pages/Profile/EditProfile";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Orders from "../pages/Dashboard/Orders";
import Wishlist from "../pages/Dashboard/Wishlist";
import PickupSlots from "../pages/Dashboard/PickupSlots";
import Addresses from "../pages/Dashboard/Addresses";
import Settings from "../pages/Dashboard/Settings";

function AppRoutes() {
  return (
    <Routes>
      {/* Pages with Navbar & Footer */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/profile" element={<MyProfile />} />

        <Route path="/profile/edit" element={<EditProfile />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="slots" element={<PickupSlots />} />
        <Route path="address" element={<Addresses />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Pages without Navbar & Footer */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
