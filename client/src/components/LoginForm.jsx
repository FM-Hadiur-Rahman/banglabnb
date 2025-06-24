import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logError } from "../utils/logError";

import axios from "axios";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); // Clear old message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.data.user?.isVerified) {
        alert("⚠️ Please verify your email before logging in.");
        setIsLoading(false);
        return;
      }

      // ✅ Save token & user only if verified
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("✅ Logged in successfully!");

      setFormData({ email: "", password: "" });

      // ✅ Redirect based on role
      const userRole = res.data.user?.role || "user";
      navigate(
        userRole === "admin"
          ? "/admin/dashboard"
          : userRole === "host"
          ? "/host/dashboard"
          : userRole === "driver"
          ? "/dashboard/driver"
          : "/dashboard"
      );
    } catch (err) {
      toast.error("❌ Login failed. Please check your credentials.");
      logError(err, "LoginForm.submit", formData.email);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user?.isVerified) {
      const role = user.role || "user";
      navigate(
        role === "admin"
          ? "/admin/dashboard"
          : role === "host"
          ? "/host/dashboard"
          : role === "driver"
          ? "/dashboard/driver"
          : "/dashboard"
      );
    }
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-sm mt-2">
        <a href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot password?
        </a>
      </p>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default LoginForm;
