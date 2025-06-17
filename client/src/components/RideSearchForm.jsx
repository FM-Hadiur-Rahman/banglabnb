import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RideSearchForm = ({ onResults }) => {
  const [tripFrom, setTripFrom] = useState("");
  const [tripTo, setTripTo] = useState("");
  const [tripDate, setTripDate] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips`);
      const trips = res.data;

      const filtered = trips.filter((trip) => {
        const matchesFrom =
          !tripFrom || trip.from.toLowerCase().includes(tripFrom.toLowerCase());
        const matchesTo =
          !tripTo || trip.to.toLowerCase().includes(tripTo.toLowerCase());
        const matchesDate = !tripDate || trip.date.startsWith(tripDate);

        return matchesFrom && matchesTo && matchesDate;
      });

      onResults(filtered);
    } catch (err) {
      console.error("❌ Error fetching trips", err);
      onResults([]); // fallback to empty if error
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="space-y-4 bg-white p-4 rounded shadow max-w-md mx-auto"
    >
      <input
        type="text"
        placeholder="From (e.g. Dhaka)"
        value={tripFrom}
        onChange={(e) => setTripFrom(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="To (e.g. Cox’s Bazar)"
        value={tripTo}
        onChange={(e) => setTripTo(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="date"
        value={tripDate}
        onChange={(e) => setTripDate(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
      >
        🔍 Search Rides
      </button>
      <p className="text-sm text-center text-gray-500">
        Want to do an{" "}
        <Link to="/trip-search" className="text-blue-600 underline">
          Advanced Search
        </Link>
        ?
      </p>
    </form>
  );
};

export default RideSearchForm;
