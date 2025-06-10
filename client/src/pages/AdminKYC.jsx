import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";

const AdminKYC = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPending = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/kyc/pending`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPendingUsers(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleKycAction = async (userId, action) => {
    const reason =
      action === "rejected" ? prompt("Reason for rejection?") : null;
    const token = localStorage.getItem("token");

    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/admin/kyc/${userId}`,
      { status: action, reason },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPending(); // refresh
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">🪪 Pending KYC Verifications</h2>
      {pendingUsers.length === 0 ? (
        <p className="text-gray-600">No pending verifications.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded shadow border flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{user.email}</p>
              <p className="text-sm text-gray-500 mb-3">Role: {user.role}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <img
                  src={user.idDocumentUrl}
                  alt="NID"
                  className="w-48 h-auto rounded shadow"
                />

                <img
                  src={user.livePhotoUrl}
                  alt="Selfie"
                  className="w-48 h-auto rounded shadow"
                />
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => handleKycAction(user._id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleKycAction(user._id, "rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminKYC;
