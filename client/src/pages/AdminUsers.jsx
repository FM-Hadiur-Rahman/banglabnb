import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("📦 Fetched users:", res.data);

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.warn("⚠️ Unexpected user response:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("❌ Failed to load users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/soft-delete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
    }
  };
  const restoreUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers(); // refresh after restore
    } catch (err) {
      console.error("❌ Failed to restore user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleExportCSV = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/export/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportExcel = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/export/users-xlsx`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <button
        onClick={handleExportCSV}
        className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
      >
        ⬇ Export CSV
      </button>
      <button
        onClick={handleExportExcel}
        className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
      >
        📊 Export Excel
      </button>

      {loading ? (
        <p>Loading users...</p>
      ) : Array.isArray(users) && users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((u) => (
                <tr
                  key={u._id}
                  className={`border-t ${
                    u.isDeleted ? "bg-red-100 text-gray-500 line-through" : ""
                  }`}
                >
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isVerified ? "✅" : "❌"}</td>
                  <td>
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/admin/users/${u._id}`}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      View
                    </Link>
                  </td>
                  <td>
                    {!u.isDeleted ? (
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-red-500 hover:underline"
                      >
                        Soft Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => restoreUser(u._id)}
                        className="text-green-600 hover:underline"
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
