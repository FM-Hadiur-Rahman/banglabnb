import React from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const status = params.get("status");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-green-100 p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          ✅ Payment {status === "paid" ? "Successful" : "Status Unknown"}
        </h1>
        <p className="text-gray-700">Thank you for your booking!</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
