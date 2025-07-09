import React, { useState, useEffect } from "react";

const LocationAutocomplete = ({ placeholder = "", onSelect }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!input) return setSuggestions([]);
      const token = import.meta.env.VITE_MAPBOX_TOKEN;

      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            input
          )}.json?access_token=${token}&country=bd&limit=5`
        );
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (err) {
        console.error("❌ Mapbox error:", err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [input]);

  const handleSelect = (place) => {
    setInput(place.place_name);
    setSuggestions([]);
    onSelect({
      name: place.place_name,
      coordinates: place.center, // [lng, lat]
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="border px-4 py-2 rounded w-full"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-y-auto">
          {suggestions.map((place) => (
            <li
              key={place.id}
              onClick={() => handleSelect(place)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
