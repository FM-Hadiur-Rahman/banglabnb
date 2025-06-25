import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import MapboxAutocomplete from "../components/MapboxAutocomplete";
import { divisions } from "../data/districts";
// import { toast } from "react-toastify";

const CreateListingPage = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    maxGuests: "",
    division: "",
    district: "",
    roomType: "",
    location: null,
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const extractAdminFromMapbox = async (lon, lat) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?types=place,region&access_token=${
          import.meta.env.VITE_MAPBOX_TOKEN
        }`
      );
      const data = await res.json();
      const features = data.features || [];

      const district = features.find((f) => f.place_type.includes("place"));
      const division = features.find((f) => f.place_type.includes("region"));

      setForm((prev) => ({
        ...prev,
        division: division?.text || "",
        district: district?.text || "",
      }));
    } catch (err) {
      console.warn("❌ Reverse geocoding failed", err);
    }
  };

  const handleMapSelect = ({ coordinates, address }) => {
    setForm((prev) => ({
      ...prev,
      location: { type: "Point", coordinates, address },
    }));
    extractAdminFromMapbox(coordinates[0], coordinates[1]);
  };

  const handleAutoDetect = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${
          import.meta.env.VITE_MAPBOX_TOKEN
        }`
      );
      const data = await res.json();
      const address = data.features[0]?.place_name || "";

      setForm((prev) => ({
        ...prev,
        location: { type: "Point", coordinates: [lon, lat], address },
      }));

      await extractAdminFromMapbox(lon, lat);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    //PHONE VERIFICATION
    // if (!user.phoneVerified) {
    //   toast.warn("📱 Mobile verification required to create listing.");
    //   navigate("/verify-phone");
    //   return;
    // }

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("maxGuests", form.maxGuests);
    formData.append("division", form.division);
    formData.append("district", form.district);
    formData.append("roomType", form.roomType);
    formData.append("description", form.description || "");
    formData.append("houseRules", form.houseRules || "");
    formData.append("location", JSON.stringify(form.location));
    formData.append("hostId", user._id);

    try {
      setUploading(true);
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
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-3xl mx-auto p-4 bg-white shadow rounded space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">🏠 Create New Listing</h2>
      {/* {user.phoneVerified ? (
        <div className="text-green-600 text-sm mb-2">✅ Mobile Verified</div>
      ) : (
        <div className="text-red-600 text-sm mb-2">
          🔒 Mobile not verified —{" "}
          <Link to="/verify-phone" className="text-blue-600 underline">
            Verify now
          </Link>
        </div>
      )} */}

      <input
        name="title"
        placeholder="Listing Title"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      {/* Division & District */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="division"
          onChange={handleChange}
          value={form.division}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Division</option>
          {Object.keys(divisions).map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>

        <select
          name="district"
          onChange={handleChange}
          value={form.district}
          className="w-full p-2 border rounded"
        >
          <option value="">Select District</option>
          {(divisions[form.division] || []).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Room Type */}
      <select
        name="roomType"
        value={form.roomType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Room Type</option>
        <option value="Hotel">Hotel</option>
        <option value="Resort">Resort</option>
        <option value="Guest House">Guest House</option>
        <option value="Personal Property">Personal Property</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        name="description"
        placeholder="e.g. A cozy cottage near the tea gardens of Sylhet with free breakfast and Wi-Fi."
        onChange={handleChange}
        className="w-full p-2 border rounded"
        rows={4}
      />

      <textarea
        name="houseRules"
        placeholder="e.g. No smoking, Check-out by 11am, No loud music after 10pm"
        onChange={handleChange}
        className="w-full p-2 border rounded"
        rows={3}
      />

      {/* Price, Guests, Auto Detect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="price"
          type="number"
          placeholder="Price per night (BDT)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="maxGuests"
          type="number"
          placeholder="Max Guests"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="button"
          onClick={handleAutoDetect}
          className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
        >
          📍 Auto-detect Location
        </button>
      </div>

      <label className="block font-medium mt-4 mb-1">🗺 Select on Map</label>
      <MapboxAutocomplete
        onSelectLocation={handleMapSelect}
        formLocation={form.location}
      />
      {form.location?.address && (
        <p className="text-sm text-gray-600 mt-1">
          📌 Selected Location: {form.location.address}
        </p>
      )}

      {/* Upload Images */}
      <input
        name="images"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files))}
        className="w-full mt-2"
      />
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              className="w-20 h-20 object-cover rounded border"
              alt="Preview"
            />
          ))}
        </div>
      )}

      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full"
      >
        ✅ Submit Listing
      </button>
    </form>
  );
};

export default CreateListingPage;
