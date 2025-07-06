import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const EditTripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    totalSeats: 1,
    farePerSeat: 0,
    vehicleType: "car",
    vehicleModel: "",
    licensePlate: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/trips/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const {
          from,
          to,
          date,
          time,
          totalSeats,
          farePerSeat,
          vehicleType,
          vehicleModel,
          licensePlate,
          image,
        } = res.data;
        setFormData({
          from,
          to,
          date,
          time,
          totalSeats,
          farePerSeat,
          vehicleType,
          vehicleModel,
          licensePlate,
          image,
        });
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error("❌ Trip not found");
          navigate("/dashboard/driver");
        } else {
          toast.error("❌ Failed to load trip data");
        }
        console.error(err);
      }
    };
    fetchTrip();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = dayjs();
    const tripDateTime = dayjs(`${formData.date} ${formData.time}`);

    if (tripDateTime.isBefore(now)) {
      return toast.error("❌ Trip date/time must be in the future");
    }

    try {
      setLoading(true);
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      if (imageFile) form.append("image", imageFile);

      await axios.put(`${import.meta.env.VITE_API_URL}/api/trips/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Trip updated successfully");
      navigate("/dashboard/driver");
    } catch (err) {
      console.error("❌ Update failed", err);
      toast.error(err.response?.data?.message || "❌ Failed to update trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Trip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="from"
          value={formData.from}
          onChange={handleChange}
          placeholder="From"
          className="input"
          required
        />
        <input
          type="text"
          name="to"
          value={formData.to}
          onChange={handleChange}
          placeholder="To"
          className="input"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="number"
          name="totalSeats"
          value={formData.totalSeats}
          onChange={handleChange}
          className="input"
          min={1}
          required
        />
        <input
          type="number"
          name="farePerSeat"
          value={formData.farePerSeat}
          onChange={handleChange}
          className="input"
          min={0}
          required
        />
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          className="input"
        >
          <option value="car">🚗 Car</option>
          <option value="bike">🏍️ Bike</option>
          <option value="microbus">🚐 Microbus</option>
        </select>
        <input
          type="text"
          name="vehicleModel"
          value={formData.vehicleModel}
          onChange={handleChange}
          placeholder="Vehicle Model"
          className="input"
        />
        <input
          type="text"
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleChange}
          placeholder="License Plate"
          className="input"
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload New Vehicle Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Current Vehicle"
              className="w-48 mt-2 rounded"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Saving..." : "💾 Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditTripForm;
