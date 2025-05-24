// // SearchBar.jsx - Filter Listings
// import React, { useState } from "react";

// const SearchBar = ({ onSearch }) => {
//   const [query, setQuery] = useState("");

//   const handleChange = (e) => {
//     setQuery(e.target.value);
//     onSearch(e.target.value);
//   };

//   return (
//     <input
//       type="text"
//       placeholder="Search by location or name"
//       value={query}
//       onChange={handleChange}
//       className="w-full p-2 border mb-4 rounded"
//     />
//   );
// };

// export default SearchBar;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  const handleSearch = () => {
    // Simple validation
    if (!location || !checkIn || !checkOut || checkOut <= checkIn) {
      setError("Please enter valid location and dates.");
      return;
    }
    setError("");

    const queryParams = new URLSearchParams({
      location,
      from: checkIn.toISOString(),
      to: checkOut.toISOString(),
      guests,
    }).toString();

    navigate(`/listings?${queryParams}`);
  };

  return (
    <div className="bg-white rounded-full shadow-md px-6 py-4 flex flex-wrap gap-4 justify-between items-center w-full max-w-5xl mx-auto">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-semibold">Where</label>
        <input
          type="text"
          placeholder="Search destinations"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border-none focus:outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-semibold">Check in</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          placeholderText="Add date"
          className="w-full border-none focus:outline-none text-gray-700"
        />
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-semibold">Check out</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          placeholderText="Add date"
          className="w-full border-none focus:outline-none text-gray-700"
        />
      </div>

      <div className="flex-1 min-w-[100px]">
        <label className="block text-sm font-semibold">Who</label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          min={1}
          className="w-full border-none focus:outline-none text-gray-700"
          placeholder="Add guests"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-rose-500 hover:bg-rose-600 text-white w-12 h-12 rounded-full flex items-center justify-center"
      >
        🔍
      </button>

      {error && (
        <p className="text-red-500 text-sm w-full text-center mt-2">{error}</p>
      )}
    </div>
  );
};

export default SearchBar;
