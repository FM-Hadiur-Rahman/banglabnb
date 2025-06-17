import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TripDetailPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/trips/${id}`)
      .then((res) => {
        setTrip(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load trip", err);
        setLoading(false);
      });
  }, [id]);

  const handleRequestRide = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/request`,
        {
          tripId: trip._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Ride request sent!");
    } catch (err) {
      console.error("❌ Ride request failed", err);
      alert("❌ Ride request failed");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading trip details...</p>;
  if (!trip)
    return <p className="text-center mt-10 text-red-600">Trip not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            🚗 Trip from {trip.from} to {trip.to}
          </h1>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
            {trip.status || "Available"}
          </span>
        </div>

        {/* Date & Time */}
        <div className="mb-4 text-gray-600">
          <p>
            <strong>Date:</strong> {trip.date}
          </p>
          <p>
            <strong>Time:</strong> {trip.time}
          </p>
        </div>

        {/* Fare & Vehicle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p>
              <strong>Fare per seat:</strong> ৳{trip.farePerSeat}
            </p>
            <p>
              <strong>Seats Available:</strong> {trip.seatsAvailable}
            </p>
          </div>
          <div>
            <p>
              <strong>Vehicle Type:</strong> {trip.vehicleType}
            </p>
            <p>
              <strong>Model:</strong> {trip.vehicleModel || "N/A"}
            </p>
            <p>
              <strong>License Plate:</strong> {trip.licensePlate || "N/A"}
            </p>
          </div>
        </div>

        {/* Image */}
        {trip.image && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              🖼 Vehicle Image
            </h3>
            <img
              src={trip.image}
              alt="Vehicle"
              className="w-full max-w-md rounded border shadow"
            />
          </div>
        )}

        {/* Location Map */}
        {trip.location?.coordinates && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              📍 Pickup Location
            </h3>
            <iframe
              title="Trip Map"
              width="100%"
              height="300"
              loading="lazy"
              className="rounded border"
              src={`https://maps.google.com/maps?q=${trip.location.coordinates[1]},${trip.location.coordinates[0]}&z=14&output=embed`}
            ></iframe>
            <p className="text-sm mt-2 text-gray-500">
              {trip.location.address}
            </p>
          </div>
        )}

        {/* Driver Info */}
        {trip.driverId && typeof trip.driverId === "object" && (
          <div className="flex items-center gap-4 py-4 border-t">
            <img
              src={trip.driverId.avatar || "/default-avatar.png"}
              alt="Driver"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {trip.driverId.name}
              </p>
              <p className="text-sm text-gray-600">
                📞 {trip.driverId.phone || "Not available"}
              </p>
              <div className="flex gap-2 mt-2">
                {trip.driverId.phone && (
                  <a
                    href={`tel:${trip.driverId.phone}`}
                    className="text-blue-600 underline text-sm"
                  >
                    Call Driver
                  </a>
                )}
                <button
                  onClick={() =>
                    navigate(
                      `/chat?receiver=${trip.driverId._id}&tripId=${trip._id}`
                    )
                  }
                  className="text-green-600 underline text-sm"
                >
                  Message Driver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reserve Button */}
        {user?._id !== trip.driverId?._id && (
          <button
            onClick={handleRequestRide}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded font-semibold text-lg"
          >
            🚀 Reserve Seat
          </button>
        )}

        {/* Reviews (placeholder) */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            ⭐ Trip Reviews
          </h3>
          <p className="text-sm text-gray-500 italic">
            No reviews yet. Be the first to leave one after your ride.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
