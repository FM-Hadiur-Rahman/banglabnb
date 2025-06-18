import React, { useEffect, useState } from "react";
import axios from "axios";
import RideResults from "./RideResults";
import { toast } from "react-toastify";

const MyRidesTab = () => {
  const [myRides, setMyRides] = useState([]);

  const fetchRides = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/trips/my-rides`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMyRides(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch my rides", err);
      toast.error("Could not load your reserved rides.");
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">🚘 My Reserved Rides</h2>

      <button
        onClick={fetchRides}
        className="mb-4 px-4 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
      >
        🔄 Refresh
      </button>

      <RideResults
        trips={myRides}
        onCancel={async (trip) => {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/trips/${trip._id}/cancel`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            toast.success("❌ Ride canceled");
            setMyRides((prev) =>
              prev.map((t) => (t._id === trip._id ? res.data.trip : t))
            );
          } catch (err) {
            console.error("❌ Cancel failed", err);
            toast.error("Could not cancel ride.");
          }
        }}
      />
    </div>
  );
};

export default MyRidesTab;
