import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MapboxAutocomplete from "../components/MapboxAutocomplete";

const CreateListingPage = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    image: "",
    coordinates: [], // [lng, lat]
    maxGuests: "", // ✅ NEW
  });

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/listings/upload`,
        formData
      );
      setForm({ ...form, image: res.data.imageUrl });
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };
  const handleMapSelect = ({ coordinates, address }) => {
    console.log("📍 Selected location:", coordinates, address); // ✅ DEBUG log
    setForm((prev) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: coordinates,
        address: address,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // ✅ get host ID

    const newListing = {
      title: form.title,
      price: form.price,
      image: form.image,
      maxGuests: form.maxGuests,
      location: {
        type: "Point",
        coordinates: form.location.coordinates, // [lng, lat]
        address: form.location.address,
      },
      hostId: user._id, // ✅ keep this
    };

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/listings`,
      newListing,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("Listing created!");
    navigate("/host/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <input
        name="location"
        placeholder="Location"
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <input
        name="price"
        placeholder="Price"
        type="number"
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <input
        name="maxGuests"
        placeholder="Maximum Guests"
        type="number"
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full p-2 border mb-2"
      />
      {uploading && <p>Uploading image...</p>}

      {form.image && (
        <img
          src={form.image}
          alt="Preview"
          className="w-full h-48 object-cover rounded mb-2"
        />
      )}
      <MapboxAutocomplete onSelectLocation={handleMapSelect} />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </form>
  );
};

export default CreateListingPage;
