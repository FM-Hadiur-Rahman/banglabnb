import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TripDetailPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/trips/${id}`)
      .then((res) => setTrip(res.data))
      .catch((err) => console.error("❌ Failed to load trip", err));
  }, [id]);

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Trip Details</h1>
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
        <strong>Fare:</strong> ৳{trip.farePerSeat}
      </p>
      <p>
        <strong>Vehicle:</strong> {trip.vehicleType}
      </p>
    </div>
  );
};

export default TripDetailPage;
