import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MapboxAutocomplete from "../components/MapboxAutocomplete";

const CreateListingPage = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    maxGuests: "", // ✅ NEW
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("maxGuests", form.maxGuests);
    formData.append("division", form.division || "");
    formData.append("district", form.district || "");
    formData.append("location", JSON.stringify(form.location));
    formData.append("hostId", user._id);

    try {
      setUploading(true); // ✅ start uploading

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/listings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("✅ Listing created!");
      navigate("/host/dashboard");
    } catch (err) {
      alert("❌ Failed to create listing.");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-xl mx-auto p-4"
    >
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
        name="images"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setImages([...e.target.files])}
      />

      {uploading && <p>Uploading image...</p>}

      {images.length > 0 &&
        images.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            className="w-20 h-20 object-cover inline-block mr-2 rounded"
          />
        ))}

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
