import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your booking. Your payment has been confirmed.
        </p>
        <Link
          to="/dashboard"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
