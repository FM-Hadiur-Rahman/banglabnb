import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const SignupFormStep2 = () => {
  const [idDocument, setIdDocument] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("idDocument", idDocument);
    formData.append("livePhoto", livePhoto);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup/step2`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.removeItem("signupUserId");
      setMessage("✅ Identity verification submitted. Awaiting approval.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit verification.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md max-w-md mx-auto mt-10"
    >
      <h2 className="text-xl font-bold text-center mb-2">
        Step 2: Identity Verification
      </h2>

      <label className="block">Upload NID or Passport</label>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setIdDocument(e.target.files[0])}
        required
      />

      <label className="block">Upload Live Photo Holding ID</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLivePhoto(e.target.files[0])}
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        Submit for Review
      </button>

      {message && <p className="mt-2 text-center text-red-500">{message}</p>}
    </form>
  );
};

export default SignupFormStep2;
