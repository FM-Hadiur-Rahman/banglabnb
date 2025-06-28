import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:static sm:inset-0`}
      >
        <div className="p-6 space-y-4">
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
            <Link to="/admin/payouts" className="hover:underline">
              💸 Payouts
            </Link>
            <Link to="/admin/refunds" className="hover:text-yellow-300">
              💸 Refunds
            </Link>
            <Link
              to="/admin/payouts/overdue"
              className="hover:text-yellow-400 font-semibold"
            >
              ⏰ Overdue Payouts
            </Link>
            <Link to="/admin/banners" className="hover:underline">
              🖼 Banners
            </Link>
            <Link to="/admin/logs" className="hover:underline">
              📨 Logs
            </Link>
            <Link to="/admin/promocodes" className="hover:underline">
              🏷️ Promocodes
            </Link>
            <Link to="/admin/referrals" className="hover:underline">
              🤝 Referrals
            </Link>
            <Link to="/admin/setting" className="hover:underline">
              ⚙️ Settings
            </Link>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between bg-gray-800 text-white px-4 py-3 shadow">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
