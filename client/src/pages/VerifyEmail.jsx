// src/pages/VerifyEmail.jsx
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, {
          token,
        })
        .then(() =>
          setMessage("✅ Email verified successfully. You can log in.")
        )
        .catch(() => setMessage("❌ Invalid or expired token."));
    } else {
      setMessage("❌ No token provided.");
    }
  }, []);

  return <h2 className="text-center mt-8">{message}</h2>;
};

export default VerifyEmail;
