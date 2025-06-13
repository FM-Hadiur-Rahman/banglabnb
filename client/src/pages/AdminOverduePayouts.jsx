import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOverduePayouts = () => {
  const [overdue, setOverdue] = useState([]);

  useEffect(() => {
    const fetchOverdue = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payouts/overdue`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOverdue(res.data);
    };

    fetchOverdue();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⏰ Overdue Payouts</h1>

      {overdue.length === 0 ? (
        <p className="text-gray-500">✅ No overdue payouts!</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Booking ID</th>
              <th className="p-2">Guest</th>
              <th className="p-2">Listing</th>
              <th className="p-2">Check-in</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {overdue.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-2">{b._id}</td>
                <td className="p-2">{b.guestId?.name}</td>
                <td className="p-2">{b.listingId?.title}</td>
                <td className="p-2">
                  {new Date(b.checkInAt).toLocaleDateString()}
                </td>
                <td className="p-2 font-semibold">৳ {b.paidAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOverduePayouts;
