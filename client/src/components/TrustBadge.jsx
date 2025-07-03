import { useEffect, useState } from "react";

const TrustBadge = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300); // delay animation
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="hidden sm:block fixed bottom-6 right-6 z-50 animate-slide-in bg-green-700 text-white shadow-lg rounded-lg px-4 py-3 text-sm w-64 transition-all duration-700">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold">✅ Verified & Trusted</h4>
        <button
          onClick={() => setVisible(false)}
          className="text-white text-lg font-bold leading-none hover:text-red-300"
          aria-label="Close trust badge"
        >
          ×
        </button>
      </div>
      <ul className="list-disc list-inside space-y-1 text-xs text-white/90 mt-2">
        <li>Verified by National ID</li>
        <li>Secure Payments</li>
        <li>Comfortable Stays</li>
      </ul>
    </div>
  );
};

export default TrustBadge;
