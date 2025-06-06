import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { divisions } from "../data/districts"; // path based on your project

const SearchBar = () => {
  const navigate = useNavigate();
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const districts = division ? divisions[division] : [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (district) params.append("location", district);
    if (checkIn) params.append("from", checkIn.toISOString());
    if (checkOut) params.append("to", checkOut.toISOString());
    if (guests) params.append("guests", guests);

    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow px-6 py-4 flex flex-wrap gap-4 items-end max-w-6xl mx-auto">
      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-semibold">Division</label>
        <select
          value={division}
          onChange={(e) => {
            setDivision(e.target.value);
            setDistrict(""); // reset district
          }}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select Division</option>
          {Object.keys(divisions).map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-semibold">District</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select District</option>
          {districts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-semibold">Check In</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          placeholderText="Add date"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-semibold">Check Out</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          placeholderText="Add date"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex-1 min-w-[100px]">
        <label className="text-sm font-semibold">Guests</label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded font-semibold"
      >
        🔍 Search
      </button>
    </div>
  );
};

export default SearchBar;
