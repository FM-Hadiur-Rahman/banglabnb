import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { Link } from "react-router-dom";

const AdminSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/search?query=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
      alert("Search error");
    }
  };

  const handleExport = async (type) => {
    const token = localStorage.getItem("token");
    window.open(
      `${
        import.meta.env.VITE_API_URL
      }/api/admin/export-search?query=${query}&type=${type}&token=${token}`,
      "_blank"
    );
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">🔍 Admin Search</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="User ID, Email, Booking ID, Listing Title, Transaction ID..."
          className="border px-4 py-2 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {results && (
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => handleExport("csv")}
            className="btn btn-outline"
          >
            ⬇ Export CSV
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="btn btn-outline"
          >
            🧾 Export PDF
          </button>
        </div>
      )}

      {results?.user && (
        <div className="bg-white shadow p-4 rounded mb-4">
          <h3 className="font-semibold">👤 User Info</h3>
          <p>
            <b>Name:</b> {results.user.name}
          </p>
          <p>
            <b>Email:</b> {results.user.email}
          </p>
          <p>
            <b>Role:</b> {results.user.role}
          </p>
          <p>
            <b>ID:</b> {results.user._id}
          </p>
          <Link
            to={`/admin/users/${results.user._id}`}
            className="text-blue-600 underline"
          >
            View full user page
          </Link>
        </div>
      )}

      {results?.booking && (
        <div className="bg-white shadow p-4 rounded mb-4">
          <h3 className="font-semibold">📦 Booking Info</h3>
          <p>
            <b>ID:</b> {results.booking._id}
          </p>
          <p>
            <b>Guest:</b> {results.booking.guestId?.name}
          </p>
          <p>
            <b>Listing:</b> {results.booking.listingId?.title}
          </p>
          <p>
            <b>Dates:</b> {results.booking.dateFrom} → {results.booking.dateTo}
          </p>
          <p>
            <b>Status:</b> {results.booking.paymentStatus}
          </p>
          <Link
            to={`/admin/bookings/${results.booking._id}`}
            className="text-blue-600 underline"
          >
            View full booking page
          </Link>
        </div>
      )}

      {results?.tripReservation && (
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold">🚘 Trip Reservation</h3>
          <p>
            <b>User:</b> {results.tripReservation.userId?.name}
          </p>
          <p>
            <b>Trip ID:</b> {results.tripReservation.tripId?._id}
          </p>
          <p>
            <b>Status:</b> {results.tripReservation.status}
          </p>
          <p>
            <b>Transaction:</b> {results.tripReservation.tran_id}
          </p>
          <Link
            to={`/admin/trips/${results.tripReservation.tripId?._id}`}
            className="text-blue-600 underline"
          >
            View full trip page
          </Link>
        </div>
      )}

      {results &&
        !results.user &&
        !results.booking &&
        !results.tripReservation && (
          <p className="text-red-500">❌ No matches found.</p>
        )}
    </AdminLayout>
  );
};

export default AdminSearch;
