import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const TripSearchPage = () => {
  const [trips, setTrips] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/trips`
        );
        const allTrips = res.data;

        // Get values from URL
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const date = searchParams.get("date");

        // If no filters, show all trips
        if (!from && !to && !date) {
          setTrips(allTrips);
        } else {
          const filtered = allTrips.filter((trip) => {
            return (
              (!from || trip.from.toLowerCase().includes(from.toLowerCase())) &&
              (!to || trip.to.toLowerCase().includes(to.toLowerCase())) &&
              (!date || trip.date.startsWith(date))
            );
          });
          setTrips(filtered);
        }
      } catch (err) {
        console.error("❌ Failed to fetch trips", err);
      }
    };

    fetchTrips();
  }, [searchParams]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🚗 Available Rides</h2>
        <button
          onClick={() => (window.location.href = "/ride-search")}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          🔄 Reset Filters
        </button>
      </div>
      {trips.length === 0 ? (
        <p>No trips found</p>
      ) : (
        trips.map((trip) => (
          <div
            key={trip._id}
            className="border p-4 mb-2 rounded shadow-sm bg-white"
          >
            <p>
              <strong>From:</strong> {trip.from}
            </p>
            <p>
              <strong>To:</strong> {trip.to}
            </p>
            <p>
              <strong>Date:</strong> {trip.date.slice(0, 10)}
            </p>
            <p>
              <strong>Time:</strong> {trip.time}
            </p>
            <p>
              <strong>Vehicle:</strong> {trip.vehicleType}
            </p>
            <p>
              <strong>Fare:</strong> ৳{trip.farePerSeat} per seat
            </p>
            <p>
              <strong>Seats Available:</strong> {trip.seatsAvailable}
            </p>
            {/* Future: Add booking button */}
          </div>
        ))
      )}
    </div>
  );
};

export default TripSearchPage;
