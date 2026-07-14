import { Outlet } from "react-router-dom";
import CustomerSidebar from "../Dashboard/CustomerSidebar";
import Topbar from "../Dashboard/Topbar";

function CustomerLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <CustomerSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
