import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("❌ No token provided.");
      return;
    }

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`
      )
      .then(() => {
        setMessage("✅ Email verified successfully. Redirecting to login...");

        // ✅ Delay before navigating to login
        const timeout = setTimeout(() => {
          navigate("/login");
        }, 3000);

        // Optional: cleanup timeout
        return () => clearTimeout(timeout);
      })
      .catch(() => setMessage("❌ Invalid or expired token."));
  }, [searchParams, navigate]);

  return (
    <div className="text-center mt-10 text-lg font-semibold">{message}</div>
  );
};

export default VerifyEmail;
