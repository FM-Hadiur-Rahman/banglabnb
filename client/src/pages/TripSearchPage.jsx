import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const TripSearchPage = () => {
  const [trips, setTrips] = useState([]);
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check login
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setIsLoggedIn(true);
          setUser(res.data.user);
        })
        .catch(() => setIsLoggedIn(false));
    }
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/trips`
        );
        const allTrips = res.data;

        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const date = searchParams.get("date");

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

  const handleRequestRide = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        {
          type: "ride-request",
          message: `🚗 New ride request from ${user.name}`,
          tripId: selectedTrip._id,
          receiverId: selectedTrip.driverId._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("✅ Ride request sent to driver!");
      setShowModal(false);
    } catch (err) {
      console.error("❌ Failed to send request", err);
      alert("❌ Failed to send ride request");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
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
            className="border p-4 mb-4 rounded shadow bg-white"
          >
            {/* 👤 Driver info */}
            <div className="flex items-center space-x-4 mb-3">
              <img
                src={trip.driverId?.avatar || "/default-avatar.png"}
                alt="Driver Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{trip.driverId?.name}</p>
                {trip.driverId?.driver?.vehicleModel && (
                  <p className="text-sm text-gray-500">
                    {trip.driverId.driver.vehicleModel}
                  </p>
                )}
              </div>
            </div>

            {/* 🚗 Ride details */}
            <p>
              <strong>From:</strong> {trip.from} → <strong>To:</strong>{" "}
              {trip.to}
            </p>
            <p>
              <strong>Date:</strong> {trip.date.slice(0, 10)} |{" "}
              <strong>Time:</strong> {trip.time}
            </p>
            <p>
              <strong>Vehicle:</strong>{" "}
              {trip.vehicleType === "car" ? "🚗 Car" : "🏍️ Bike"}
            </p>
            <p>
              <strong>Fare:</strong> ৳{trip.farePerSeat} |{" "}
              <strong>Seats:</strong> {trip.seatsAvailable}
            </p>

            {/* Request button */}
            <button
              onClick={() => handleRequestRide(trip)}
              disabled={!isLoggedIn}
              className={`mt-3 px-4 py-2 rounded text-white ${
                isLoggedIn
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              📩 Request Ride
            </button>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Ride Request</h3>
            <p>
              Are you sure you want to send a ride request to{" "}
              <strong>{selectedTrip.driverId?.name}</strong>?
            </p>
            <p className="text-sm text-gray-600">
              From: {selectedTrip.from} → To: {selectedTrip.to}
              <br />
              Date: {selectedTrip.date.slice(0, 10)} | Time: {selectedTrip.time}
              <br />
              Fare: ৳{selectedTrip.farePerSeat}
            </p>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="px-4 py-1 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSearchPage;
