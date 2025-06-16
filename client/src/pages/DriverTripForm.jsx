import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DriverTripForm = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    vehicleType: "car",
    seatsAvailable: 1,
    farePerSeat: 0,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/trips`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("✅ Trip created!");
      navigate("/dashboard/driver"); // or your driver trip list page
    } catch (err) {
      setMessage("❌ Failed to create trip");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 p-6 bg-white shadow"
    >
      <h2 className="text-xl font-bold">🚗 Create a Trip</h2>

      <input
        name="from"
        placeholder="From (e.g. Dhaka)"
        onChange={handleChange}
        required
      />
      <input
        name="to"
        placeholder="To (e.g. Cox’s Bazar)"
        onChange={handleChange}
        required
      />
      <input type="date" name="date" onChange={handleChange} required />
      <input type="time" name="time" onChange={handleChange} required />

      <select name="vehicleType" onChange={handleChange}>
        <option value="car">Car</option>
        <option value="bike">Bike</option>
      </select>

      <input
        type="number"
        name="seatsAvailable"
        min="1"
        placeholder="Seats"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="farePerSeat"
        placeholder="Fare per seat (৳)"
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Publish Trip
      </button>

      {message && <p className="text-red-500">{message}</p>}
    </form>
  );
};

export default DriverTripForm;
