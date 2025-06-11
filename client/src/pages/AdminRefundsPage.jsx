import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout"; // ✅ your shared admin layout

const AdminRefundsPage = () => {
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/refund-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setRefunds(res.data))
      .catch((err) => console.error("❌ Failed to load refunds", err));
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
      <h1 className="text-2xl font-bold mb-4">💸 Pending Refund Requests</h1>
      {refunds.length === 0 ? (
        <p>No refund requests found.</p>
      ) : (
        <div className="grid gap-4">
          {refunds.map((booking) => (
            <div key={booking._id} className="p-4 border rounded bg-white">
              <p>
                <strong>Guest:</strong> {booking.guestId?.name} (
                {booking.guestId?.email})
              </p>
              <p>
                <strong>Listing:</strong> {booking.listingId?.title}
              </p>
              <p>
                <strong>Refund Amount:</strong> ৳
                {Math.abs(booking.extraPayment.amount)}
              </p>
              <p>
                <strong>Status:</strong> {booking.extraPayment.status}
              </p>
              <button
                onClick={() => markAsRefunded(booking._id)}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
              >
                ✅ Mark as Refunded
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminRefundsPage;
