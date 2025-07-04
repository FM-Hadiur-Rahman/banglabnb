import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminTripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTrip(res.data))
      .catch((err) => {
        console.error("Failed to fetch trip", err);
        setTrip(null);
      });
  }, [id]);

  if (!trip)
    return (
      <AdminLayout>
        <p className="text-gray-500">❌ Trip not found.</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">🚘 Trip Details</h2>
      <div className="bg-white p-4 shadow rounded">
        <p>
          <strong>From:</strong> {trip.from}
        </p>
        <p>
          <strong>To:</strong> {trip.to}
        </p>
        <p>
          <strong>Date:</strong> {trip.date}
        </p>
        <p>
          <strong>Time:</strong> {trip.time}
        </p>
        <p>
          <strong>Seats:</strong> {trip.totalSeats}
        </p>
        <p>
          <strong>Available:</strong> {trip.availableSeats}
        </p>
        <p>
          <strong>Fare:</strong> ৳{trip.fare}
        </p>
        <p>
          <strong>Driver:</strong> {trip.driver?.name} ({trip.driver?.email})
        </p>
        <p>
          <strong>Vehicle:</strong> {trip.vehicleType} - {trip.vehicleNumber}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {trip.isCancelled ? "❌ Cancelled" : "✅ Active"}
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminTripDetails;
