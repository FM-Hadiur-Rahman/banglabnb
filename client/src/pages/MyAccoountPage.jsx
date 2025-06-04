import React, { useEffect, useState } from "react";
import axios from "axios";

const MyAccountPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch user profile:", err));
  }, []);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">👤 My Account</h1>

      <div className="space-y-4 text-gray-800">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone || "Not added"}
        </div>
        <div>
          <strong>Role:</strong> {user.role}
        </div>
        <div>
          <strong>Email Verified:</strong>{" "}
          <span className={user.isVerified ? "text-green-600" : "text-red-600"}>
            {user.isVerified ? "✅ Yes" : "❌ No"}
          </span>
        </div>
        <div>
          <strong>Phone Verified:</strong>{" "}
          <span
            className={user.phoneVerified ? "text-green-600" : "text-red-600"}
          >
            {user.phoneVerified ? "✅ Yes" : "❌ No"}
          </span>
        </div>
        <div>
          <strong>Identity Verified:</strong>{" "}
          <span
            className={
              user.identityVerified ? "text-green-600" : "text-red-600"
            }
          >
            {user.identityVerified ? "✅ Yes" : "❌ No"}
          </span>
        </div>

        {user.avatar && (
          <div>
            <strong>Profile Photo:</strong>
            <img
              src={user.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full border mt-2"
            />
          </div>
        )}

        {user.idDocumentUrl && (
          <div>
            <strong>ID Document:</strong>
            <a
              href={user.idDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block mt-1"
            >
              View ID
            </a>
          </div>
        )}

        {user.livePhotoUrl && (
          <div>
            <strong>Live Photo:</strong>
            <img
              src={user.livePhotoUrl}
              alt="live selfie"
              className="w-24 h-24 rounded border mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;
