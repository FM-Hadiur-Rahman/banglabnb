// components/MyRidesTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RideResults from "./RideResults";
import { toast } from "react-toastify";

const MyRidesTab = () => {
  const [myRides, setMyRides] = useState([]);

  useEffect(() => {
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

    fetchRides();
  }, []);

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">🚘 My Reserved Rides</h2>
      <RideResults trips={myRides} />
    </div>
  );
};

export default MyRidesTab;
