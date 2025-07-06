import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PaymentDetailsForm from "../components/PaymentDetailsForm";

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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        👤 My Account
      </h1>

      <div className="md:flex md:justify-between gap-10">
        {/* LEFT SIDE – Account Info */}
        <div className="md:w-1/2 space-y-5 bg-gray-50 p-6 rounded border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📋 Account Information
          </h2>

          <div>
            <span className="font-medium text-gray-600">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-medium text-gray-600">Email:</span>{" "}
            {user.email}
          </div>
          <div>
            <span className="font-medium text-gray-600">Phone:</span>{" "}
            {user.phone || "Not added"}
          </div>
          <div>
            <span className="font-medium text-gray-600">Role:</span>{" "}
            <span className="capitalize">{user.role}</span>
          </div>

          <div>
            <span className="font-medium text-gray-600">Email Verified:</span>{" "}
            <span
              className={user.isVerified ? "text-green-600" : "text-red-600"}
            >
              {user.isVerified ? "✅ Yes" : "❌ No"}
            </span>
          </div>

          <div>
            <span className="font-medium text-gray-600">Phone Verified:</span>{" "}
            {user.phoneVerified ? (
              <span className="text-green-600">✅ Verified</span>
            ) : (
              <Link to="/verify-phone" className="text-blue-600 underline">
                🔴 Not Verified – Verify Now
              </Link>
            )}
          </div>

          <div>
            <span className="font-medium text-gray-600">
              Identity Verified:
            </span>{" "}
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
              <span className="font-medium text-gray-600">Profile Photo:</span>
              <img
                src={user.avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full border mt-2 shadow-sm"
              />
            </div>
          )}

          {user.idDocumentUrl && (
            <div>
              <span className="font-medium text-gray-600">ID Document:</span>
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
              <span className="font-medium text-gray-600">Live Photo:</span>
              <img
                src={user.livePhotoUrl}
                alt="live selfie"
                className="w-24 h-24 rounded border mt-2 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* RIGHT SIDE – Payment Form */}
        {(user.role === "host" || user.role === "driver") && (
          <div className="md:w-1/2 mt-10 md:mt-0">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              💳 Payout Account Details
            </h2>
            <PaymentDetailsForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;
