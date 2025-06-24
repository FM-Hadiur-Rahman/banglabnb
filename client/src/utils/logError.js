// utils/logError.js
import axios from "axios";

export const logError = (err, context = "", user = null) => {
  if (import.meta.env.MODE === "development") {
    console.error(`[DEV] ${context}`, err);
  }

  if (import.meta.env.MODE === "production") {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/logs`, {
        message: err?.message || "Unknown error",
        stack: err?.stack || "",
        context,
        user,
      })
      .catch(() => {
        // Avoid recursive error if logging fails
        console.warn("📤 Failed to send log to server");
      });
  }
};
