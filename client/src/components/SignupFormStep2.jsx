import React, { useState } from "react";
import axios from "axios";

const SignupFormStep2 = ({ userId }) => {
  const [idDocument, setIdDocument] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("idDocument", idDocument);
    formData.append("livePhoto", livePhoto);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-identity`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Identity verification submitted. Awaiting approval.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit verification.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md"
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
