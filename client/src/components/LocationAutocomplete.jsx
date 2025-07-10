import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { fetchSuggestions } from "../utils/mapboxUtils"; // ✅ make sure this file exists

const LocationAutocomplete = ({
  placeholder,
  onSelect,
  showCurrent = false,
  value = "",
}) => {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      const results = await fetchSuggestions(query);
      setSuggestions(results);
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 2) debouncedSearch(val);
    else setSuggestions([]);
  };

  const handleSelect = (place) => {
    setSuggestions([]);
    onSelect({
      name: place.place_name,
      coordinates: place.center, // [lng, lat]
    });
  };

  const handleUseCurrent = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = [pos.coords.longitude, pos.coords.latitude];
      const res = await fetchSuggestions(coords.join(","), true);
      const place = res?.[0];
      if (place) handleSelect(place);
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="border px-4 py-2 rounded w-full"
        placeholder={placeholder}
        value={input}
        onChange={handleInputChange}
      />
      {showCurrent && (
        <button
          type="button"
          onClick={handleUseCurrent}
          className="absolute right-3 top-2 text-xs text-blue-600"
        >
          📍 Use GPS
        </button>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow-md max-h-40 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              {s.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
