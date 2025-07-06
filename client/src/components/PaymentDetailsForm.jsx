import { useState, useEffect } from "react";
import axios from "axios";

export default function PaymentDetailsForm() {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/payment-details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setForm(res.data))
      .catch(() =>
        setForm({
          accountType: "bkash",
          accountNumber: "",
          accountName: "",
          bankName: "",
          routingNumber: "",
        })
      );
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/payment-details`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Payment details saved");
      setEditing(false);
    } catch (err) {
      alert("❌ Failed to save payment details");
      console.error(err);
    }

    setLoading(false);
  };

  if (!form) return <p>Loading payment details...</p>;

  const maskedAccount =
    form.accountNumber?.length >= 4
      ? form.accountNumber.replace(/.(?=.{4})/g, "*") // 28315******0478 style
      : "********";

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm">
      {!editing ? (
        <>
          <h3 className="font-semibold text-lg mb-3">🔒 Current Payout Info</h3>
          <p>
            <strong>Method:</strong>{" "}
            {form.accountType === "bank"
              ? "🏦 Bank Account"
              : form.accountType
              ? `📱 ${
                  form.accountType.charAt(0).toUpperCase() +
                  form.accountType.slice(1)
                }`
              : "📱 Mobile Wallet"}
          </p>
          <p>
            <strong>Account Name:</strong> {form.accountName || "—"}
          </p>
          <p>
            <strong>Account Number:</strong> {maskedAccount}
          </p>
          {form.accountType === "bank" && (
            <>
              <p>
                <strong>Bank Name:</strong> {form.bankName || "—"}
              </p>
              <p>
                <strong>Routing Number:</strong> {form.routingNumber || "—"}
              </p>
            </>
          )}
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✏️ Edit Payment Info
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Payment Method</label>
            <select
              name="accountType"
              onChange={handleChange}
              value={form.accountType}
              className="w-full border rounded px-3 py-2"
            >
              <option value="bkash">📱 bKash</option>
              <option value="nagad">📱 Nagad</option>
              <option value="rocket">📱 Rocket</option>
              <option value="bank">🏦 Bank Account</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Account Holder Name
            </label>
            <input
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              {form.accountType === "bank"
                ? "Bank Account Number"
                : "Mobile Wallet Number"}
            </label>
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {form.accountType === "bank" && (
            <>
              <div>
                <label className="block font-medium mb-1">Bank Name</label>
                <input
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Routing Number</label>
                <input
                  name="routingNumber"
                  value={form.routingNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "💾 Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
