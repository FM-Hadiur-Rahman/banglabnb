// components/AdminLayout.jsx
import React from "react";
import { Navigate } from "react-router-dom";

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
          <a href="/admin/dashboard" className="hover:underline">
            Dashboard
          </a>
          <a href="/admin/users" className="hover:underline">
            Users
          </a>
          <a href="/admin/listings" className="hover:underline">
            Listings
          </a>
          <a href="/admin/bookings" className="hover:underline">
            Bookings
          </a>
          <a href="/admin/user-breakdown" className="hover:underline">
            User Breakdown
          </a>
          <a href="/admin/kyc" className="hover:underline">
            KYC Verifications
          </a>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
