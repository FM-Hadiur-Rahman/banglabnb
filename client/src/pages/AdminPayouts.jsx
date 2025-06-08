import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/payouts/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayouts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Failed to fetch payouts:", err);
    }
  };

  const markAsPaid = async (id) => {
    if (!window.confirm("Are you sure you want to mark this payout as PAID?"))
      return;

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
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
      <h2 className="text-2xl font-bold mb-6">💸 Pending Host Payouts</h2>

      {loading ? (
        <p>Loading payouts...</p>
      ) : payouts.length === 0 ? (
        <p className="text-gray-500">No pending payouts.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100 text-sm text-left">
              <tr>
                <th className="p-3">Host</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Amount (৳)</th>
                <th className="p-3">Booking Date</th>
                <th className="p-3">Method</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {payouts.map((payout) => (
                <tr key={payout._id} className="border-t">
                  <td className="p-3 font-semibold">
                    {payout.hostId?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    <div>{payout.hostId?.email}</div>
                    <div className="text-gray-500 text-xs">
                      {payout.hostId?.phone}
                    </div>
                  </td>
                  <td className="p-3 font-medium">
                    {payout.amount?.toLocaleString()}
                  </td>
                  <td className="p-3">
                    {new Date(payout.bookingId?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 capitalize">{payout.method}</td>
                  <td className="p-3">
                    <button
                      onClick={() => markAsPaid(payout._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
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
    </AdminLayout>
  );
};

export default AdminPayouts;
