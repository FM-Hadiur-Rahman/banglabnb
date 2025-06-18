import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DriverDashboard = () => {
  const [trips, setTrips] = useState([]);

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
      }
    };
    fetchMyTrips();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🚘 My Posted Rides</h2>

      <Link
        to="/dashboard/driver/trips/new"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        ➕ Create New Trip
      </Link>

      {trips.length === 0 ? (
        <p className="text-gray-600">You haven't posted any trips yet.</p>
      ) : (
        trips.map((trip) => (
          <div
            key={trip._id}
            className="border p-4 rounded shadow mb-4 bg-white"
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
              <strong>Vehicle:</strong> {trip.vehicleType}
            </p>
            <p>
              <strong>Fare:</strong> ৳{trip.farePerSeat} |{" "}
              <strong>Seats:</strong> {trip.totalSeats}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  trip.status === "available"
                    ? "text-green-600"
                    : trip.status === "booked"
                    ? "text-yellow-600"
                    : "text-red-500"
                }
              >
                {trip.status}
              </span>
            </p>
            {/* Optional: Add cancel/edit buttons here */}
          </div>
        ))
      )}
    </div>
  );
};

export default DriverDashboard;
