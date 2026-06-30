import { Outlet } from "react-router-dom";
import Sidebar from "../Admin/Sidebar";

function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
