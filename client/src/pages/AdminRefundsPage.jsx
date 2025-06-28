import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminRefundsPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/refund-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("📦 Refund requests:", res.data);
        setRefunds(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("❌ Failed to load refunds", err);
        setRefunds([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const markAsRefunded = async (bookingId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/mark-refunded/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefunds((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error("❌ Refund marking failed", err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">💸 Pending Refund Requests</h1>

        {loading ? (
          <p>Loading refunds...</p>
        ) : refunds.length === 0 ? (
          <p className="text-gray-500 italic">✅ No refund requests found.</p>
        ) : (
          <div className="grid gap-4">
            {refunds.map((booking) => (
              <div
                key={booking._id}
                className="p-4 border rounded bg-white shadow-sm"
              >
                <p>
                  <strong>👤 Guest:</strong> {booking.guestId?.name} (
                  {booking.guestId?.email})
                </p>
                <p>
                  <strong>🏡 Listing:</strong> {booking.listingId?.title}
                </p>
                <p>
                  <strong>💰 Refund Amount:</strong> ৳
                  {Math.abs(booking.extraPayment?.amount ?? 0)}
                </p>
                <p>
                  <strong>📌 Status:</strong>{" "}
                  <span className="font-semibold text-yellow-600">
                    {booking.extraPayment?.status ?? "N/A"}
                  </span>
                </p>
                <button
                  onClick={() => markAsRefunded(booking._id)}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded"
                >
                  ✅ Mark as Refunded
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRefundsPage;
