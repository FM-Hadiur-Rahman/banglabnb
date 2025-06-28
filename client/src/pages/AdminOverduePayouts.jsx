import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOverduePayouts = () => {
  const [overdue, setOverdue] = useState([]);

  useEffect(() => {
    const fetchOverdue = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payouts/overdue`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOverdue(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch overdue payouts:", err);
      }
    };

    fetchOverdue();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">⏰ Overdue Payouts</h1>

      {overdue.length === 0 ? (
        <p className="text-gray-500 italic">✅ No overdue payouts!</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Booking ID</th>
                <th className="px-4 py-2 text-left">Guest</th>
                <th className="px-4 py-2 text-left">Listing</th>
                <th className="px-4 py-2 text-left">Check-in</th>
                <th className="px-4 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {overdue.map((b) => (
                <tr key={b._id}>
                  <td className="px-4 py-2 text-blue-700 break-all">{b._id}</td>
                  <td className="px-4 py-2">{b.guestId?.name || "—"}</td>
                  <td className="px-4 py-2">{b.listingId?.title || "—"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {b.checkInAt
                      ? new Date(b.checkInAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2 font-semibold text-green-600">
                    ৳ {b.paidAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOverduePayouts;
