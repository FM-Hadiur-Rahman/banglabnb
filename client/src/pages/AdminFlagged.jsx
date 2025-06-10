// pages/AdminFlagged.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminFlagged = () => {
  const [flagged, setFlagged] = useState({
    users: [],
    listings: [],
    reviews: [],
  });

  const fetchFlagged = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/flagged`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFlagged(res.data);
    } catch (err) {
      console.error("❌ Failed to load flagged content:", err);
    }
  };

  const removeFlag = async (type, id) => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/flag/${type}/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFlagged();
    } catch (err) {
      alert("❌ Failed to remove flag.");
    }
  };

  useEffect(() => {
    fetchFlagged();
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">🚩 Flagged Content</h2>

      {/* Flagged Users */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        {flagged.users.length === 0 ? (
          <p className="text-gray-500">✅ No flagged users.</p>
        ) : (
          <ul className="space-y-3">
            {flagged.users.map((u) => (
              <li
                key={u._id}
                className="bg-white p-4 shadow rounded flex justify-between"
              >
                <div>
                  <p>
                    <strong>{u.name}</strong> ({u.email}) –{" "}
                    {u.reason || "No reason"}
                  </p>
                </div>
                <button
                  onClick={() => removeFlag("user", u._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Remove Flag
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Flagged Listings */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Listings</h3>
        {flagged.listings.length === 0 ? (
          <p className="text-gray-500">✅ No flagged listings.</p>
        ) : (
          <ul className="space-y-3">
            {flagged.listings.map((l) => (
              <li
                key={l._id}
                className="bg-white p-4 shadow rounded flex justify-between"
              >
                <div>
                  <p>
                    <strong>{l.title}</strong> – {l.reason || "No reason"}
                  </p>
                </div>
                <button
                  onClick={() => removeFlag("listing", l._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Remove Flag
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Flagged Reviews */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        {flagged.reviews.length === 0 ? (
          <p className="text-gray-500">✅ No flagged reviews.</p>
        ) : (
          <ul className="space-y-3">
            {flagged.reviews.map((r) => (
              <li
                key={r._id}
                className="bg-white p-4 shadow rounded flex justify-between"
              >
                <div>
                  <p>
                    “{r.text}” — by {r.author?.name || "Unknown"}
                  </p>
                </div>
                <button
                  onClick={() => removeFlag("review", r._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Remove Flag
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminFlagged;
