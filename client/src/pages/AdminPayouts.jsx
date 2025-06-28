import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/payouts/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(res.data)) {
        setPayouts(res.data);
      } else {
        console.warn("⚠️ Unexpected payout format:", res.data);
        setPayouts([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch payouts:", err);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    if (!window.confirm("Are you sure you want to mark this payout as PAID?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/payouts/${id}/mark-paid`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayouts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Failed to update payout:", err);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-6">💸 Pending Host Payouts</h2>

        {loading ? (
          <p className="text-gray-600 italic">Loading payouts...</p>
        ) : payouts.length === 0 ? (
          <p className="text-gray-500 italic">✅ No pending payouts.</p>
        ) : (
          <div className="overflow-x-auto rounded shadow bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Host</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                  <th className="px-4 py-2 text-left">Amount (৳)</th>
                  <th className="px-4 py-2 text-left">Booking Date</th>
                  <th className="px-4 py-2 text-left">Method</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.map((payout) => (
                  <tr key={payout._id}>
                    <td className="px-4 py-2 font-semibold">
                      {payout.hostId?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      <div>{payout.hostId?.email}</div>
                      <div className="text-gray-500 text-xs">
                        {payout.hostId?.phone || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-green-700">
                      {payout.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(
                        payout.bookingId?.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 capitalize">
                      {payout.method || "manual"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => markAsPaid(payout._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs md:text-sm"
                      >
                        Mark as Paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPayouts;
