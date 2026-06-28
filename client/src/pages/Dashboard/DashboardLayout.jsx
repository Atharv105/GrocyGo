import Sidebar from "../../components/Dashboard/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
