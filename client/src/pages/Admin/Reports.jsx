import { FaChartBar } from "react-icons/fa";

function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-500 mt-2">Analyse sales, inventory, and customer trends.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
          <FaChartBar size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">Analytics & Reports</h2>
        <p className="text-gray-400 mt-2 max-w-md">
          Detailed reports on revenue, best-selling products, customer activity,
          and inventory levels will be available here.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium">
          🚧 Reports coming soon
        </span>
      </div>
    </div>
  );
}

export default Reports;
