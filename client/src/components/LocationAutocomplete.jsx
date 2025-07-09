import React, { useState } from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function LocationAutocomplete({ placeholder, onSelect }) {
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    if (!query) return;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_TOKEN}&limit=5`
    );
    const data = await res.json();
    setResults(data.features);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border px-2 py-1 rounded"
        onChange={handleSearch}
      />
      <ul className="absolute bg-white border w-full z-10">
        {results.map((place) => (
          <li
            key={place.id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() =>
              onSelect({
                name: place.place_name,
                coordinates: place.geometry.coordinates,
              })
            }
          >
            {place.place_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
