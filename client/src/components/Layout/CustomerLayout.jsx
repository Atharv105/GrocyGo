import { Outlet } from "react-router-dom";
import CustomerSidebar from "../Dashboard/CustomerSidebar";

function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <CustomerSidebar />

      <div className="flex-1 overflow-y-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
