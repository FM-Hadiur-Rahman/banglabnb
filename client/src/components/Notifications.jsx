import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get("/api/notifications")
      .then((res) => {
        const notes = Array.isArray(res.data) ? res.data : [];
        setNotifications(notes);
      })
      .catch((err) => {
        console.error("Fetch notifications error:", err);
        setNotifications([]);
      });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-3">🔔 Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((note, idx) => (
          <li key={idx} className="text-gray-700">
            {note.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
