import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { fetchSuggestions } from "../utils/mapboxUtils";

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
    <div className="space-y-1">
      <div className="flex gap-2">
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
            className="text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 whitespace-nowrap"
          >
            📍 Use GPS
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="z-10 bg-white border w-full mt-1 rounded shadow-md max-h-40 overflow-y-auto">
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
