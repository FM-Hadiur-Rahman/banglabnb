import { useEffect, useState } from "react";
import axios from "axios";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/logs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("❌ Failed to fetch logs", err));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📜 Server Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Level</th>
              <th className="p-2">Message</th>
              <th className="p-2">User</th>
              <th className="p-2">Time</th>
              <th className="p-2">URL</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="p-2">{log.level}</td>
                <td className="p-2">{log.message}</td>
                <td className="p-2">{log.user?.name || "System"}</td>
                <td className="p-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-2">{log.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogs;
