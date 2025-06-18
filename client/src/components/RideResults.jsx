import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const RideResults = ({ trips = [], onReserve }) => {
  if (!trips.length)
    return <p className="text-center text-gray-600 py-6">❌ No rides found.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => {
        const isUrgent = dayjs(trip.date).diff(dayjs(), "hour") < 24;
        const isVerified = trip.driverId?.verified;
        const vehicleEmoji = trip.vehicleType === "car" ? "🚗" : "🏍️";

        return (
          <Link
            key={trip._id}
            to={`/trips/${trip._id}`}
            className="block border rounded-lg shadow hover:shadow-lg hover:border-green-500 transition-all bg-white overflow-hidden group"
          >
            {/* Map preview */}
            {trip.location?.coordinates && (
              <iframe
                title="Mini Map"
                className="w-full h-32 object-cover"
                src={`https://maps.google.com/maps?q=${trip.location.coordinates[1]},${trip.location.coordinates[0]}&z=12&output=embed`}
              ></iframe>
            )}

            <div className="p-4 space-y-2">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  {trip.from} ➡ {trip.to}
                </h2>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  ৳{trip.farePerSeat}
                </span>
              </div>

              {/* Vehicle badge */}
              <div className="flex gap-2 flex-wrap text-sm">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {vehicleEmoji} {trip.vehicleType.toUpperCase()}
                </span>
                {isVerified && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    ✅ Verified Driver
                  </span>
                )}
                {isUrgent && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full animate-pulse">
                    🔥 Urgent
                  </span>
                )}
              </div>

              {/* Basic info */}
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {trip.date.slice(0, 10)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Time:</strong> {trip.time}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Seats:</strong> {trip.seatsAvailable}
              </p>

              {/* Optional Request Button */}
              {onReserve && (
                <button
                  onClick={(e) => {
                    e.preventDefault(); // avoid redirect
                    onReserve(trip);
                  }}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
                >
                  📩 Reserve Ride
                </button>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RideResults;
