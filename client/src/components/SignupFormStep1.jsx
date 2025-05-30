import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import MapboxAutocomplete from "./MapboxAutocomplete";
import LocationSelector from "./LocationSelector";

const SignupFormStep1 = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    division: "",
    district: "",
  });
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLocationChange = (division, district) => {
    setFormData((prev) => ({ ...prev, division, district }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register-step1`,
        {
          ...formData,
          phone: `+${phone}`, // ✅ Add plus sign before sending
        }
      );

      setMessage("✅ Step 1 complete. Proceed to ID verification.");
      onSuccess(res.data.userId); // trigger step 2 in RegisterPage
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full px-4 py-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <PhoneInput
          country={"bd"}
          value={phone}
          onChange={setPhone}
          inputProps={{
            name: "phone",
            required: true,
            autoFocus: true,
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="host">Host</option>
        </select>
        {/* Pass handler to update division + district */}
        <LocationSelector
          onChange={(division, district) =>
            handleLocationChange(division, district)
          }
        />

        <MapboxAutocomplete onSelect={(place) => console.log(place)} />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? <span className="animate-spin">🔄</span> : "Sign Up"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default SignupFormStep1;
