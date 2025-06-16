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
    vehicleModel: "",
    licensePlate: "",
    seatsAvailable: 1,
    farePerSeat: 0,
    image: null,
  });
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/trips`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Trip created successfully!");
      navigate("/dashboard/driver");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create trip. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">🚗 Publish Your Ride</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="from"
            placeholder="From (e.g. Dhaka)"
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            name="to"
            placeholder="To (e.g. Cox’s Bazar)"
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="date"
            name="date"
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            type="time"
            name="time"
            onChange={handleChange}
            required
            className="input-field"
          />

          <select
            name="vehicleType"
            onChange={handleChange}
            className="input-field"
          >
            <option value="car">🚗 Car</option>
            <option value="bike">🏍️ Bike</option>
          </select>
          <input
            name="vehicleModel"
            placeholder="Vehicle Model (e.g. Toyota Axio)"
            onChange={handleChange}
            className="input-field"
          />

          <input
            name="licensePlate"
            placeholder="License Plate Number"
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="number"
            name="seatsAvailable"
            min="1"
            placeholder="Seats Available"
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            type="number"
            name="farePerSeat"
            placeholder="Fare per seat (৳)"
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* 📸 Vehicle Image Upload */}
        <div>
          <label className="block font-medium">
            Upload Vehicle Image (optional)
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="mt-1"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 w-32 h-20 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          🚀 Publish Trip
        </button>

        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default DriverTripForm;
