const axios = require("axios");

const disbursePayment = async ({
  amount,
  recipient_name,
  recipient_phone,
  reference,
}) => {
  if (process.env.NODE_ENV === "development") {
    console.log("🚧 Fake disbursement simulated in development");
    return { status: "SUCCESS" }; // simulate success response
  }

  const token = process.env.SSLCOMMERZ_DISBURSE_TOKEN;

  const payload = {
    amount,
    currency: "BDT",
    recipient_name,
    recipient_phone,
    reference,
    purpose: "host_payout",
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(
    "https://sandbox.sslcommerz.com/api/v1/disburse", // change to live URL in production
    payload,
    config
  );

  return response.data;
};

module.exports = { disbursePayment };
