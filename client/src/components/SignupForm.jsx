import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapboxAutocomplete from "../components/MapboxAutocomplete";

const SignupForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     _id: res.data._id,
      //     name: res.data.name,
      //     email: res.data.email,
      //     role: res.data.role || "user",
      //   })
      // );

      setMessage(
        "✅ Registered! Please check your email to verify your account before logging in."
      );
      navigate("/verify");

      // const userRole = res.data.role || "user";
      // navigate(userRole === "host" ? "/host/dashboard" : "/dashboard");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
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

export default SignupForm;
