import React from "react";
import { Navigate, Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">BanglaBnB Admin</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin/dashboard" className="hover:underline">
            📊 Dashboard
          </Link>
          <Link to="/admin/users" className="hover:underline">
            👤 Users
          </Link>
          <Link to="/admin/listings" className="hover:underline">
            🏠 Listings
          </Link>
          <Link to="/admin/bookings" className="hover:underline">
            📅 Bookings
          </Link>
          <Link to="/admin/user-breakdown" className="hover:underline">
            👥 User Breakdown
          </Link>
          <Link to="/admin/kyc" className="hover:underline">
            🪪 KYC Verifications
          </Link>
          <Link to="/admin/flagged" className="hover:underline">
            🚩 Flagged Content
          </Link>
          <Link to="/admin/revenue" className="hover:underline">
            💰 Revenue Analytics
          </Link>
          <Link to="/admin/payouts" className="...">
            💸 Payouts
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
