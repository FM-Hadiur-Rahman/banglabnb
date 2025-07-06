import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Bank options
const BANK_OPTIONS = [
  { value: "BRAC Bank", label: "BRAC Bank" },
  { value: "Dutch-Bangla Bank", label: "Dutch-Bangla Bank (DBBL)" },
  { value: "Islami Bank", label: "Islami Bank Bangladesh" },
  { value: "City Bank", label: "City Bank" },
  { value: "United Commercial Bank", label: "UCB" },
  { value: "Eastern Bank", label: "Eastern Bank (EBL)" },
  { value: "Southeast Bank", label: "Southeast Bank" },
  { value: "Mutual Trust Bank", label: "Mutual Trust Bank (MTB)" },
  { value: "Prime Bank", label: "Prime Bank" },
  { value: "Standard Chartered", label: "Standard Chartered Bank" },
  { value: "AB Bank", label: "AB Bank" },
  { value: "National Bank", label: "National Bank Limited" },
  { value: "Bank Asia", label: "Bank Asia" },
  { value: "Agrani Bank", label: "Agrani Bank" },
  { value: "Rupali Bank", label: "Rupali Bank" },
  { value: "Janata Bank", label: "Janata Bank" },
  { value: "NCC Bank", label: "NCC Bank" },
  { value: "One Bank", label: "One Bank" },
  { value: "Exim Bank", label: "Exim Bank" },
  { value: "First Security Islami Bank", label: "First Security Islami Bank" },
  { value: "NRB Commercial Bank", label: "NRB Commercial Bank" },
  { value: "Social Islami Bank", label: "Social Islami Bank (SIBL)" },
];

// Get label with icon
const getPaymentMethodLabel = (type) => {
  const t = (type || "").trim().toLowerCase();
  switch (t) {
    case "bkash":
      return "📱 bKash";
    case "nagad":
      return "📱 Nagad";
    case "rocket":
      return "📱 Rocket";
    case "bank":
      return "🏦 Bank Account";
    default:
      return "❓ Unknown";
  }
};

// Mask account numbers
const maskAccountNumber = (number = "") => {
  if (number.length <= 8) return number.replace(/.(?=.{2})/g, "*");
  const visibleStart = number.slice(0, 5);
  const visibleEnd = number.slice(-4);
  return `${visibleStart}${"*".repeat(number.length - 9)}${visibleEnd}`;
};

export default function PaymentDetailsForm() {
  const [form, setForm] = useState({
    accountType: "bkash",
    accountNumber: "",
    accountName: "",
    bankName: "",
    routingNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/payment-details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) setForm(res.data);
      })
      .catch(() => {
        setForm({
          accountType: "bkash",
          accountNumber: "",
          accountName: "",
          bankName: "",
          routingNumber: "",
        });
      });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBankChange = (selected) => {
    setForm((prev) => ({ ...prev, bankName: selected?.value || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/payment-details`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Payment details saved");
      setIsEditing(false);
    } catch (error) {
      toast.error("❌ Failed to save payment details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          💳 Payout Account Details
        </h2>
        {!isEditing && (
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Method */}
        <div>
          <label className="block font-medium mb-1">Payment Method</label>
          {isEditing ? (
            <select
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={loading}
            >
              <option value="bkash">📱 bKash</option>
              <option value="nagad">📱 Nagad</option>
              <option value="rocket">📱 Rocket</option>
              <option value="bank">🏦 Bank Account</option>
            </select>
          ) : (
            <p className="text-gray-700">
              {getPaymentMethodLabel(form.accountType)}
            </p>
          )}
        </div>

        {/* Account Name */}
        <div>
          <label className="block font-medium mb-1">Account Holder Name</label>
          {isEditing ? (
            <input
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={loading}
            />
          ) : (
            <p className="text-gray-700">{form.accountName || "N/A"}</p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block font-medium mb-1">
            {form.accountType === "bank"
              ? "Bank Account Number"
              : "Mobile Wallet Number"}
          </label>
          {isEditing ? (
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={loading}
            />
          ) : (
            <p className="text-gray-700">
              {maskAccountNumber(form.accountNumber)}
            </p>
          )}
        </div>

        {/* Bank-Specific Fields */}
        {form.accountType === "bank" && (
          <>
            <div>
              <label className="block font-medium mb-1">Bank Name</label>
              {isEditing ? (
                <Select
                  value={BANK_OPTIONS.find((b) => b.value === form.bankName)}
                  options={BANK_OPTIONS}
                  onChange={handleBankChange}
                  isDisabled={loading}
                />
              ) : (
                <p className="text-gray-700">{form.bankName || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Routing Number</label>
              {isEditing ? (
                <input
                  name="routingNumber"
                  value={form.routingNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  disabled={loading}
                />
              ) : (
                <p className="text-gray-700">
                  {form.routingNumber || "Not provided"}
                </p>
              )}
            </div>
          </>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "💾 Save"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
