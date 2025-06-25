import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminPromocodes = () => {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState({
    code: "",
    discount: 0,
    type: "flat", // flat or percent
    for: "stay", // stay, ride, combined, all
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchCodes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/promocode`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCodes(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch promo codes");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleCreate = async () => {
    if (!newCode.code || !newCode.discount || !newCode.type || !newCode.for) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/promocode`,
        newCode,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Promo code created!");
      setNewCode({
        code: "",
        discount: 0,
        type: "flat",
        for: "stay",
        expiresAt: "",
      });
      fetchCodes();
    } catch (err) {
      toast.error("❌ Failed to create promo code");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/promocode/${id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info("🟡 Promo code deactivated");
      fetchCodes();
    } catch (err) {
      toast.error("❌ Failed to deactivate promo code");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promo code?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/promocode/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.warn("🗑 Promo code deleted");
      fetchCodes();
    } catch (err) {
      toast.error("❌ Failed to delete promo code");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🎁 Promo Code Management</h2>

      {/* Create New Promo Code */}
      <div className="border p-4 rounded mb-6 bg-white shadow">
        <h3 className="text-lg font-semibold mb-2">➕ Create New Code</h3>
        <div className="grid md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Code"
            value={newCode.code}
            onChange={(e) =>
              setNewCode({ ...newCode, code: e.target.value.toUpperCase() })
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Discount"
            value={newCode.discount}
            onChange={(e) =>
              setNewCode({ ...newCode, discount: Number(e.target.value) })
            }
            className="border p-2 rounded"
          />
          <select
            value={newCode.type}
            onChange={(e) => setNewCode({ ...newCode, type: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="flat">Flat (৳)</option>
            <option value="percent">Percent (%)</option>
          </select>
          <select
            value={newCode.for}
            onChange={(e) => setNewCode({ ...newCode, for: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="stay">Stay</option>
            <option value="ride">Ride</option>
            <option value="combined">Combined</option>
            <option value="all">All</option>
          </select>
          <input
            type="date"
            value={newCode.expiresAt}
            onChange={(e) =>
              setNewCode({ ...newCode, expiresAt: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Promo Code"}
        </button>
      </div>

      {/* Promo Code List */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">For</th>
              <th className="px-4 py-2">Expires</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="px-4 py-2 font-mono">{c.code}</td>
                <td className="px-4 py-2">
                  {c.type === "percent" ? `${c.discount}%` : `৳${c.discount}`}
                </td>
                <td className="px-4 py-2 capitalize">{c.type}</td>
                <td className="px-4 py-2 capitalize">{c.for}</td>
                <td className="px-4 py-2">
                  {c.expiresAt?.slice(0, 10) || "—"}
                </td>
                <td className="px-4 py-2">
                  {c.active ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-500 font-medium">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  {c.active && (
                    <button
                      onClick={() => handleDeactivate(c._id)}
                      className="text-yellow-600 hover:underline"
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!codes.length && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  No promo codes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPromocodes;
