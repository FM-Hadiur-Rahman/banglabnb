import { useEffect, useState } from "react";
import axios from "axios";

const MyReferralsPage = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/auth/my-referrals`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReferrals(res.data.referrals))
      .catch((err) => console.error("Failed to fetch referrals", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">🎁 My Referrals</h2>
      <p className="mb-4">
        You have referred <strong>{referrals.length}</strong> people.
      </p>
      <ul className="space-y-2">
        {referrals.map((r) => (
          <li key={r._id} className="border p-3 rounded bg-white shadow">
            <p>
              <strong>{r.name}</strong> - {r.email}
            </p>
            <p className="text-sm text-gray-500">
              Joined: {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyReferralsPage;
