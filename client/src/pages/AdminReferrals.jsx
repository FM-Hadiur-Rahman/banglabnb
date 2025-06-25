import { useEffect, useState } from "react";
import axios from "axios";

const AdminReferrals = () => {
  const [referrers, setReferrers] = useState([]);
  const [referred, setReferred] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/referrals`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReferrers(res.data.referrers);
        setReferred(res.data.referred);
      })
      .catch((err) => console.error("Failed to fetch referral data", err));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📊 Referral Analytics</h2>

      <h3 className="text-lg font-semibold mb-2">Top Referrers</h3>
      <table className="w-full mb-8 table-auto text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Referral Code</th>
            <th className="px-4 py-2">Rewards</th>
          </tr>
        </thead>
        <tbody>
          {referrers.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2 font-mono">{u.referralCode}</td>
              <td className="px-4 py-2">{u.referralRewards || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mb-2">Referred Users</h3>
      <ul className="space-y-2">
        {referred.map((r) => (
          <li key={r._id} className="border p-3 rounded bg-white shadow">
            <p>
              <strong>{r.name}</strong> - {r.email}
            </p>
            <p className="text-sm text-gray-500">
              Referred by: <span className="font-mono">{r.referredBy}</span>,
              Joined: {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReferrals;
