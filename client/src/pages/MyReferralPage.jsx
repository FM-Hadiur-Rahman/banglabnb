import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MyReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [referralCode, setReferralCode] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReferrals = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/my-referrals`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReferrals(res.data.referrals);
    } catch (err) {
      toast.error("❌ Failed to load referrals");
    }
  };
  useEffect(() => {
    const fetchUserAndReferrals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const currentUser = res.data.user;
        setReferralCode(currentUser.referralCode); // ✅ now always fresh
      } catch (err) {
        console.warn("Failed to fetch user data");
      }

      fetchReferrals();
    };

    fetchUserAndReferrals();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">🎁 My Referrals</h2>

      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
        <h3 className="text-lg font-semibold mb-1">Your Referral Code</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={referralCode}
            className="px-3 py-2 border rounded w-40 font-mono text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(referralCode);
              toast.success("✅ Copied to clipboard");
            }}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Share this code during signup. You’ll get rewards when friends book!
        </p>
      </div>

      <h3 className="font-semibold mb-2">
        People You Referred ({referrals.length})
      </h3>
      {referrals.length === 0 ? (
        <p className="text-gray-600">You have not referred anyone yet.</p>
      ) : (
        <ul className="space-y-2">
          {referrals.map((r) => (
            <li key={r.email} className="p-3 border rounded bg-white shadow-sm">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-gray-500">{r.email}</div>
              <div className="text-xs text-gray-400">
                Joined: {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReferrals;
