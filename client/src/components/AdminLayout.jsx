import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    window.location.href = "/login";
    return null;
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
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link to="/admin/dashboard">📊 Dashboard</Link>
            <Link to="/admin/users">👤 Users</Link>
            <Link to="/admin/listings">🏠 Listings</Link>
            <Link to="/admin/bookings">📅 Bookings</Link>
            <Link to="/admin/user-breakdown">👥 User Breakdown</Link>
            <Link to="/admin/kyc">🪪 KYC Verifications</Link>
            <Link to="/admin/flagged">🚩 Flagged Content</Link>
            <Link to="/admin/revenue">💰 Revenue Analytics</Link>
            <Link to="/admin/payouts">💸 Payouts</Link>
            <Link to="/admin/payouts/overdue">⏰ Overdue Payouts</Link>
            <Link to="/admin/refunds">💸 Refunds</Link>
            <Link to="/admin/banners">🖼 Banners</Link>
            <Link to="/admin/logs">📨 Logs</Link>
            <Link to="/admin/promocodes">🏷 Promocodes</Link>
            <Link to="/admin/referrals">📢 Referrals</Link>
            <Link to="/admin/setting">⚙️ Settings</Link>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="sm:hidden bg-gray-800 text-white px-4 py-3 flex justify-between items-center shadow-md">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl"
          >
            ☰
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
