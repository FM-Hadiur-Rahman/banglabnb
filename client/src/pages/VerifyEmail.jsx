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
      .then((res) => {
        const userId = res.data.userId;
        if (!userId) {
          setMessage("❌ Email verified but userId missing.");
          return;
        }

        setMessage("✅ Email verified successfully. Redirecting to Step 2...");

        setTimeout(() => {
          navigate(`/register/step2?userId=${userId}`);
        }, 3000);
      })

      .catch(() => setMessage("❌ Invalid or expired token."));
  }, [searchParams, navigate]);

  return (
    <div className="text-center mt-10 text-lg font-semibold">{message}</div>
  );
};

export default VerifyEmail;
