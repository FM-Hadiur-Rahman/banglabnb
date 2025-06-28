// pages/AdminSettings.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminSettings = () => {
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/config`)
      .then((res) => setMaintenance(res.data.maintenanceMode));
  }, []);

  const toggleMaintenance = async () => {
    const token = localStorage.getItem("token");
    const newValue = !maintenance;

    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/admin/toggle-maintenance`,
      { maintenanceMode: newValue },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMaintenance(newValue);
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">⚙️ Admin Settings</h2>

      <div className="flex items-center gap-4">
        <span className="text-lg font-medium">
          Maintenance Mode:{" "}
          <strong className={maintenance ? "text-red-600" : "text-green-600"}>
            {maintenance ? "ON" : "OFF"}
          </strong>
        </span>
        <button
          onClick={toggleMaintenance}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {maintenance ? "Turn OFF" : "Turn ON"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
