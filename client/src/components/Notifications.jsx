import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // Or use auth context if you have it
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const notes = Array.isArray(res.data) ? res.data : [];
        setNotifications(notes);
      } catch (err) {
        console.error("Fetch notifications error:", err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-3">🔔 Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((note, idx) => (
            <li key={idx} className="text-gray-700">
              {note.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notifications found.</p>
      )}
    </div>
  );
};

export default Notifications;
