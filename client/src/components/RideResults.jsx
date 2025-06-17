import React from "react";

const RideResults = ({ trips = [], onRequest }) => {
  if (!trips.length) return <p>No rides found.</p>;

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div key={trip._id} className="border p-4 rounded shadow bg-white">
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
            <strong>Seats:</strong> {trip.seatsAvailable}
          </p>
          <p>
            <strong>Fare:</strong> ৳{trip.farePerSeat}
          </p>

          {onRequest && (
            <button
              onClick={() => onRequest(trip)}
              className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              📩 Request Ride
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RideResults;
