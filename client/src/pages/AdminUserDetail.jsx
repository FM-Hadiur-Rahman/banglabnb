// src/pages/AdminUserDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminUserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("❌ Failed to fetch user:", err);
      });
  }, [id]);

  if (!user) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>ID Verified:</strong> {user.identityVerified ? "✅" : "❌"}
        </p>
        <p>
          <strong>Signup Step:</strong> {user.signupStep}
        </p>
        <p>
          <strong>Referral Code:</strong> {user.referralCode || "—"}
        </p>
        <p>
          <strong>Phone Verified:</strong> {user.phoneVerified ? "✅" : "❌"}
        </p>
        <p>
          <strong>Status:</strong> {user.isDeleted ? "🗑 Deleted" : "✅ Active"}
        </p>

        {/* Optional: KYC Documents */}
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">KYC Documents</h3>
          <div className="flex gap-4 flex-wrap">
            {user.idDocumentUrl && (
              <a
                href={user.idDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                🪪 ID Front
              </a>
            )}
            {user.idBackUrl && (
              <a
                href={user.idBackUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔁 ID Back
              </a>
            )}
            {user.livePhotoUrl && (
              <a
                href={user.livePhotoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                🤳 Live Selfie
              </a>
            )}
          </div>
        </div>
      </div>

      <Link
        to="/admin/users"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Back to Users
      </Link>
    </AdminLayout>
  );
};

export default AdminUserDetail;
