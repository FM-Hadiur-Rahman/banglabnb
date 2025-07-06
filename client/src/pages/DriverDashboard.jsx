import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import getTimeLeft from "../utils/getTimeLeft";

const DriverDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTrips = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/trips/my`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTrips(res.data);
      } catch (err) {
        console.error("❌ Error fetching driver's trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTrips();
  }, []);

  const handleCancelTrip = async (tripId) => {
    if (!confirm("Are you sure you want to cancel this trip?")) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTrips((prev) =>
        prev.map((trip) =>
          trip._id === tripId ? { ...trip, status: "cancelled" } : trip
        )
      );
      alert("✅ Trip cancelled successfully");
    } catch (err) {
      console.error("❌ Cancel trip failed:", err);
      alert("❌ Failed to cancel trip");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🚘 My Posted Rides</h2>

      <Link
        to="/dashboard/driver/trips/new"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        ➕ Create New Trip
      </Link>

      {loading ? (
        <p className="text-gray-500">Loading your trips...</p>
      ) : trips.length === 0 ? (
        <p className="text-gray-600">You haven't posted any trips yet.</p>
      ) : (
        trips.map((trip) => {
          const isExpired = getTimeLeft(trip.date, trip.time) === "Departed";
          const reservedSeats =
            trip.passengers
              ?.filter((p) => p.status !== "cancelled")
              .reduce((sum, p) => sum + (Number(p.seats) || 1), 0) || 0;
          const availableSeats = Math.max(
            (trip.totalSeats || 0) - reservedSeats,
            0
          );

          return (
            <div
              key={trip._id}
              className={`border p-4 rounded shadow mb-4 bg-white relative ${
                isExpired ? "opacity-60" : ""
              }`}
            >
              <p>
                <strong>From:</strong> {trip.from} → <strong>To:</strong>{" "}
                {trip.to}
              </p>
              <p>
                <strong>Date:</strong> {trip.date.slice(0, 10)} |{" "}
                <strong>Time:</strong> {trip.time}
              </p>
              <p>
                <strong>Countdown:</strong> {getTimeLeft(trip.date, trip.time)}
              </p>
              <p>
                <strong>Fare:</strong> ৳{trip.farePerSeat} |{" "}
                <strong>Seats:</strong> {trip.totalSeats} ({availableSeats}{" "}
                left)
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    trip.status === "available"
                      ? "text-green-600"
                      : trip.status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {trip.status}
                </span>
              </p>

              {trip.paymentStatus && (
                <p className="text-sm text-gray-600">
                  💰 <strong>Payment Status:</strong> {trip.paymentStatus}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/trips/${trip._id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
                {!isExpired && trip.status !== "cancelled" && (
                  <Link
                    to={`/dashboard/driver/trips/edit/${trip._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                )}
                {!isExpired && trip.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancelTrip(trip._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DriverDashboard;
