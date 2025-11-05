// src/pages/PaymentDetailsForm.jsx
import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { api } from "../services/api"; // ✅ centralized axios
import "react-toastify/dist/ReactToastify.css";

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

const getPaymentMethodLabel = (type) => {
  const t = (type || "").trim().toLowerCase();
  if (t === "bkash") return "📱 bKash";
  if (t === "nagad") return "📱 Nagad";
  if (t === "rocket") return "📱 Rocket";
  if (t === "bank") return "🏦 Bank Account";
  return "❓ Unknown";
};

const maskAccountNumber = (number = "") => {
  if (!number) return "—";
  if (number.length <= 8) return number.replace(/.(?=.{2})/g, "*");
  const visibleStart = number.slice(0, 5);
  const visibleEnd = number.slice(-4);
  return `${visibleStart}${"*".repeat(number.length - 9)}${visibleEnd}`;
};

export default function PaymentDetailsForm({ onSaved }) {
  const [form, setForm] = useState({
    accountType: "bkash",
    accountNumber: "",
    accountName: "",
    bankName: "",
    routingNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [verified, setVerified] = useState(false);

  // Load existing payment details + verification status
  useEffect(() => {
    const load = async () => {
      try {
        const pd = await api.get("/api/users/payment-details");
        if (pd.data) {
          setForm((prev) => ({ ...prev, ...pd.data }));
          setVerified(Boolean(pd.data.verified));
        }
        // also get user snapshot so verified is always current if backend returns it there
        const me = await api.get("/api/auth/me");
        const v = Boolean(me?.data?.user?.paymentDetails?.verified);
        setVerified(v);
        // keep local cache fresh
        if (me?.data?.user) {
          localStorage.setItem("user", JSON.stringify(me.data.user));
        }
      } catch (e) {
        // keep defaults
      }
    };
    load();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBankChange = (selected) =>
    setForm((prev) => ({ ...prev, bankName: selected?.value || "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // 1) Save
      await api.put("/api/users/payment-details", form);

      // 2) Refresh the user cache **HERE**
      const me = await api.get("/api/auth/me");
      if (me?.data?.user) {
        localStorage.setItem("user", JSON.stringify(me.data.user));
        setVerified(Boolean(me.data.user.paymentDetails?.verified));
      }
      // 🔔 notify parent page that save completed
      onSaved?.();
      toast.success("✅ Payment details saved");
      setIsEditing(false);

      // Heads-up if backend resets verified=false after sensitive edits
      if (!me?.data?.user?.paymentDetails?.verified) {
        toast.info(
          "ℹ️ Your payout needs verification. We’ll notify you when it’s approved."
        );
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to save payment details";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const bankSelectValue =
    form.accountType === "bank"
      ? BANK_OPTIONS.find((b) => b.value === form.bankName) || null
      : null;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-1">
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

      {/* Verification badge */}
      <p className="mb-4 text-sm">
        Status:{" "}
        <span
          className={`px-2 py-0.5 rounded-full font-medium ${
            verified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {verified ? "Verified" : "Pending verification"}
        </span>
      </p>

      {/* Optional hint that editing sensitive fields resets verification */}
      <p className="text-xs text-gray-500 mb-4">
        Note: Changing account number, holder name, bank or routing may reset
        verification until approved.
      </p>

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

        {/* Bank-specific fields */}
        {form.accountType === "bank" && (
          <>
            <div>
              <label className="block font-medium mb-1">Bank Name</label>
              {isEditing ? (
                <Select
                  value={bankSelectValue}
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

        {/* Actions */}
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
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
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
