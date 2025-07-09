// === LocationAutocomplete.jsx ===
import React, { useState, useRef, useEffect } from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function LocationAutocomplete({
  placeholder,
  onSelect,
  showCurrent = false,
}) {
  const [results, setResults] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setInputValue(query);
    if (!query) return setResults([]);

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_TOKEN}&limit=5`
    );
    const data = await res.json();
    setResults(data.features);
  };

  const handleSelect = (place) => {
    const name = place.place_name;
    const coordinates = place.geometry.coordinates;
    onSelect({ name, coordinates });
    setInputValue(name);
    setResults([]);
  };

  const handleUseCurrent = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      const place = data.features[0];
      onSelect({ name: place.place_name, coordinates: [longitude, latitude] });
      setInputValue(place.place_name);
      setResults([]);
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        placeholder={placeholder}
        className="w-full border px-2 py-1 rounded"
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute bg-white border w-full z-10 max-h-60 overflow-y-auto shadow-md rounded"
        >
          {showCurrent && (
            <li
              className="p-2 text-blue-600 font-medium cursor-pointer hover:bg-gray-100"
              onClick={handleUseCurrent}
            >
              📍 Use Current Location
            </li>
          )}
          {results.map((place) => (
            <li
              key={place.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(place)}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
