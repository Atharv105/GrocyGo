import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/Layout/MainLayout";
import CustomerLayout from "../components/Layout/CustomerLayout";
import AdminLayout from "../components/Layout/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import MyProfile from "../pages/Profile/MyProfile";
import EditProfile from "../pages/Profile/EditProfile";
import Dashboard from "../pages/Dashboard/Dashboard";
import Orders from "../pages/Dashboard/Orders";
import Wishlist from "../pages/Dashboard/Wishlist";
import PickupSlots from "../pages/Dashboard/PickupSlots";
import Addresses from "../pages/Dashboard/Addresses";
import Settings from "../pages/Dashboard/Settings";
import AdminDashboard from "../pages/Admin/Dashboard";
import Categories from "../pages/Admin/Categories";
import Products from "../pages/Admin/Products";

function AppRoutes() {
  return (
    <Routes>
      {/* Pages with Navbar & Footer */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/profile" element={<MyProfile />} />

        <Route path="/profile/edit" element={<EditProfile />} />
      </Route>

      <Route element={<CustomerLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/wishlist" element={<Wishlist />} />
        <Route path="/dashboard/slots" element={<PickupSlots />} />
        <Route path="/dashboard/address" element={<Addresses />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/products" element={<Products />} />
      </Route>

      {/* Pages without Navbar & Footer */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
