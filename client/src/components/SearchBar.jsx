// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import DatePicker from "react-datepicker";
// // import { useTranslation } from "react-i18next";
// // import i18n from "i18next";
// // import "react-datepicker/dist/react-datepicker.css";
// // import { divisions } from "../data/districts";

// // const SearchBar = () => {
// //   const navigate = useNavigate();
// //   const { t } = useTranslation();
// //   const [division, setDivision] = useState("");
// //   const [district, setDistrict] = useState("");
// //   const [checkIn, setCheckIn] = useState(null);
// //   const [checkOut, setCheckOut] = useState(null);
// //   const [guests, setGuests] = useState(1);

// //   const districts = division ? divisions[division] : [];
// //   const toBanglaNumber = (number) => {
// //     const enToBn = {
// //       0: "০",
// //       1: "১",
// //       2: "২",
// //       3: "৩",
// //       4: "৪",
// //       5: "৫",
// //       6: "৬",
// //       7: "৭",
// //       8: "৮",
// //       9: "৯",
// //     };
// //     return number
// //       .toString()
// //       .split("")
// //       .map((d) => enToBn[d] || d)
// //       .join("");
// //   };

// //   const handleSearch = () => {
// //     const params = new URLSearchParams();
// //     if (district) params.append("location", district);
// //     if (checkIn) params.append("from", checkIn.toISOString());
// //     if (checkOut) params.append("to", checkOut.toISOString());
// //     if (guests) params.append("guests", guests);
// //     navigate(`/listings?${params.toString()}`);
// //   };

// //   return (
// //     <div className="bg-white rounded-xl shadow px-6 py-4 flex flex-wrap gap-4 items-end max-w-6xl mx-auto">
// //       <div className="flex-1 min-w-[150px]">
// //         <label className="text-sm font-semibold">{t("search.division")}</label>
// //         <select
// //           value={division}
// //           onChange={(e) => {
// //             setDivision(e.target.value);
// //             setDistrict(""); // reset district
// //           }}
// //           className="w-full border rounded px-2 py-1"
// //         >
// //           <option value="">{t("search.select_division")}</option>
// //           {Object.keys(divisions).map((div) => (
// //             <option key={div} value={div}>
// //               {t(`division.${div}`)}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       <div className="flex-1 min-w-[150px]">
// //         <label className="text-sm font-semibold">{t("search.district")}</label>
// //         <select
// //           value={district}
// //           onChange={(e) => setDistrict(e.target.value)}
// //           className="w-full border rounded px-2 py-1"
// //         >
// //           <option value="">{t("search.select_district")}</option>
// //           {districts.map((dist) => (
// //             <option key={dist} value={dist}>
// //               {t(`district.${dist}`)}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       <div className="flex-1 min-w-[150px]">
// //         <label className="text-sm font-semibold">{t("search.check_in")}</label>
// //         <DatePicker
// //           selected={checkIn}
// //           onChange={(date) => setCheckIn(date)}
// //           selectsStart
// //           startDate={checkIn}
// //           endDate={checkOut}
// //           minDate={new Date()}
// //           placeholderText={t("search.add_date")}
// //           className="w-full border rounded px-2 py-1"
// //         />
// //       </div>

// //       <div className="flex-1 min-w-[150px]">
// //         <label className="text-sm font-semibold">{t("search.check_out")}</label>
// //         <DatePicker
// //           selected={checkOut}
// //           onChange={(date) => setCheckOut(date)}
// //           selectsEnd
// //           startDate={checkIn}
// //           endDate={checkOut}
// //           minDate={checkIn || new Date()}
// //           placeholderText={t("search.add_date")}
// //           className="w-full border rounded px-2 py-1"
// //         />
// //       </div>

// //       <div className="flex-1 min-w-[100px]">
// //         <label className="text-sm font-semibold">{t("search.guests")}</label>
// //         <input
// //           type="text"
// //           inputMode="numeric"
// //           pattern="[0-9]*"
// //           value={i18n.language === "bn" ? toBanglaNumber(guests) : guests}
// //           onChange={(e) => {
// //             const raw = e.target.value.replace(/[^\d]/g, "");
// //             setGuests(Number(raw));
// //           }}
// //           className="w-full border rounded px-2 py-1"
// //         />
// //       </div>

// //       <button
// //         onClick={handleSearch}
// //         className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded font-semibold"
// //       >
// //         {t("search.search_btn")}
// //       </button>
// //     </div>
// //   );
// // };

// // export default SearchBar;

// // === SearchBar.jsx ===
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import { useTranslation } from "react-i18next";
// import i18n from "i18next";
// import "react-datepicker/dist/react-datepicker.css";
// import { divisions } from "../data/districts";

// const SearchBar = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [division, setDivision] = useState("");
//   const [district, setDistrict] = useState("");
//   const [checkIn, setCheckIn] = useState(null);
//   const [checkOut, setCheckOut] = useState(null);
//   const [guests, setGuests] = useState(1);
//   const [keyword, setKeyword] = useState("");
//   const [tags, setTags] = useState([]);
//   const [sortBy, setSortBy] = useState("");

//   const [useGeo, setUseGeo] = useState(false);
//   const [coords, setCoords] = useState({ lat: null, lng: null });
//   const [radius, setRadius] = useState(10); // default 10 km

//   const availableTags = ["AC", "Sea View", "Wifi", "Resort", "Family Friendly"];
//   const districts = division ? divisions[division] : [];
//   const detectLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCoords({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//         setUseGeo(true);
//       },
//       (error) => {
//         alert("Unable to retrieve your location");
//         console.error(error);
//       }
//     );
//   };
//   const toBanglaNumber = (number) => {
//     const enToBn = {
//       0: "০",
//       1: "১",
//       2: "২",
//       3: "৩",
//       4: "৪",
//       5: "৫",
//       6: "৬",
//       7: "৭",
//       8: "৮",
//       9: "৯",
//     };
//     return number
//       .toString()
//       .split("")
//       .map((d) => enToBn[d] || d)
//       .join("");
//   };

//   const handleTagChange = (e) => {
//     const value = e.target.value;
//     setTags((prev) =>
//       prev.includes(value)
//         ? prev.filter((tag) => tag !== value)
//         : [...prev, value]
//     );
//   };

//   const handleSearch = () => {
//     const params = new URLSearchParams();
//     if (district) params.append("location", district);
//     if (checkIn) params.append("from", checkIn.toISOString());
//     if (checkOut) params.append("to", checkOut.toISOString());
//     if (guests && guests !== 1) params.append("guests", guests);

//     if (keyword) params.append("keyword", keyword);
//     if (tags.length > 0) params.append("tags", tags.join(","));
//     if (sortBy) params.append("sortBy", sortBy);
//     if (useGeo && coords.lat && coords.lng) {
//       params.append("lat", coords.lat);
//       params.append("lng", coords.lng);
//       params.append("radius", radius);
//     }
//     params.append("page", 1);
//     navigate(`/listings?${params.toString()}`);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow px-6 py-4 flex flex-wrap gap-4 items-end max-w-7xl mx-auto">
//       {/* Division */}
//       <div className="flex-1 min-w-[150px]">
//         <label className="text-sm font-semibold">{t("search.division")}</label>
//         <select
//           value={division}
//           onChange={(e) => {
//             setDivision(e.target.value);
//             setDistrict("");
//           }}
//           className="w-full border rounded px-2 py-1"
//         >
//           <option value="">{t("search.select_division")}</option>
//           {Object.keys(divisions).map((div) => (
//             <option key={div} value={div}>
//               {t(`division.${div}`)}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* District */}
//       <div className="flex-1 min-w-[150px]">
//         <label className="text-sm font-semibold">{t("search.district")}</label>
//         <select
//           value={district}
//           onChange={(e) => setDistrict(e.target.value)}
//           className="w-full border rounded px-2 py-1"
//         >
//           <option value="">{t("search.select_district")}</option>
//           {districts.map((dist) => (
//             <option key={dist} value={dist}>
//               {t(`district.${dist}`)}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Check-in Date */}
//       <div className="flex-1 min-w-[150px]">
//         <label className="text-sm font-semibold">{t("search.check_in")}</label>
//         <DatePicker
//           selected={checkIn}
//           onChange={(date) => setCheckIn(date)}
//           selectsStart
//           startDate={checkIn}
//           endDate={checkOut}
//           minDate={new Date()}
//           placeholderText={t("search.add_date")}
//           className="w-full border rounded px-2 py-1"
//         />
//       </div>

//       {/* Check-out Date */}
//       <div className="flex-1 min-w-[150px]">
//         <label className="text-sm font-semibold">{t("search.check_out")}</label>
//         <DatePicker
//           selected={checkOut}
//           onChange={(date) => setCheckOut(date)}
//           selectsEnd
//           startDate={checkIn}
//           endDate={checkOut}
//           minDate={checkIn || new Date()}
//           placeholderText={t("search.add_date")}
//           className="w-full border rounded px-2 py-1"
//         />
//       </div>

//       {/* Guests */}
//       <div className="flex-1 min-w-[100px]">
//         <label className="text-sm font-semibold">{t("search.guests")}</label>
//         <input
//           type="text"
//           inputMode="numeric"
//           pattern="[0-9]*"
//           value={i18n.language === "bn" ? toBanglaNumber(guests) : guests}
//           onChange={(e) =>
//             setGuests(Number(e.target.value.replace(/[^\d]/g, "")))
//           }
//           className="w-full border rounded px-2 py-1"
//         />
//       </div>

//       {/* Keyword Search */}
//       <div className="flex-1 min-w-[150px]">
//         <label className="text-sm font-semibold">{t("search.keyword")}</label>
//         <input
//           type="text"
//           value={keyword}
//           onChange={(e) => setKeyword(e.target.value)}
//           placeholder={t("search.add_keyword")}
//           className="w-full border rounded px-2 py-1"
//         />
//       </div>

//       {/* Tags Filter */}
//       <div className="w-full flex flex-wrap gap-3 items-center mt-2">
//         <label className="text-sm font-semibold w-full">
//           {t("search.tags")}
//         </label>
//         {availableTags.map((tag) => (
//           <label key={tag} className="flex items-center gap-1 text-sm">
//             <input
//               type="checkbox"
//               value={tag}
//               checked={tags.includes(tag)}
//               onChange={handleTagChange}
//               className="accent-rose-500"
//             />
//             {tag}
//           </label>
//         ))}
//       </div>

//       {/* Sort By */}
//       <div className="flex-1 min-w-[150px] mt-2">
//         <label className="text-sm font-semibold">{t("search.sort_by")}</label>
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="w-full border rounded px-2 py-1"
//         >
//           <option value="">{t("search.default_sort")}</option>
//           <option value="priceAsc">{t("search.price_low_high")}</option>
//           <option value="priceDesc">{t("search.price_high_low")}</option>
//           <option value="rating">{t("search.rating")}</option>
//           <option value="popular">{t("search.popular")}</option>
//         </select>
//       </div>
//       {/* Sort by GEO-LOCATION */}
//       <div className="w-full flex flex-wrap gap-4 items-end mt-2">
//         <button
//           onClick={detectLocation}
//           className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
//         >
//           📍 Use My Location
//         </button>
//         {useGeo && (
//           <div className="flex items-center gap-2 text-sm">
//             <label>Radius (km):</label>
//             <input
//               type="number"
//               min="1"
//               value={radius}
//               onChange={(e) => setRadius(Number(e.target.value))}
//               className="border rounded px-2 py-1 w-20"
//             />
//           </div>
//         )}
//       </div>

//       {/* Search Button */}
//       <button
//         onClick={handleSearch}
//         className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded font-semibold mt-2"
//       >
//         {t("search.search_btn")}
//       </button>
//     </div>
//   );
// };

// export default SearchBar;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "react-datepicker/dist/react-datepicker.css";
import { divisions } from "../data/districts";
import {
  MapPin,
  Users,
  Calendar,
  Search,
  Tag,
  SlidersHorizontal,
  Crosshair,
} from "lucide-react";

const SearchBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [useGeo, setUseGeo] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [radius, setRadius] = useState(10);

  const availableTags = ["AC", "Sea View", "Wifi", "Resort", "Family Friendly"];
  const districts = division ? divisions[division] : [];

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUseGeo(true);
      },
      () => alert("Failed to detect location")
    );
  };

  const toBanglaNumber = (num) => {
    const map = {
      0: "০",
      1: "১",
      2: "২",
      3: "৩",
      4: "৪",
      5: "৫",
      6: "৬",
      7: "৭",
      8: "৮",
      9: "৯",
    };
    return num
      .toString()
      .split("")
      .map((d) => map[d] || d)
      .join("");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (district) params.append("location", district);
    if (checkIn) params.append("from", checkIn.toISOString());
    if (checkOut) params.append("to", checkOut.toISOString());
    if (guests && guests !== 1) params.append("guests", guests);
    if (keyword) params.append("keyword", keyword);
    if (tags.length > 0) params.append("tags", tags.join(","));
    if (sortBy) params.append("sortBy", sortBy);
    if (useGeo && coords.lat && coords.lng) {
      params.append("lat", coords.lat);
      params.append("lng", coords.lng);
      params.append("radius", radius);
    }
    params.append("page", 1);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow rounded-full px-4 py-3 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      {/* Location Dropdowns */}
      <div className="flex items-center gap-2">
        <MapPin size={18} />
        <select
          value={division}
          onChange={(e) => {
            setDivision(e.target.value);
            setDistrict("");
          }}
          className="bg-gray-100 rounded-full px-4 py-2 text-sm"
        >
          <option value="">{t("search.select_division")}</option>
          {Object.keys(divisions).map((d) => (
            <option key={d} value={d}>
              {t(`division.${d}`)}
            </option>
          ))}
        </select>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="bg-gray-100 rounded-full px-4 py-2 text-sm"
        >
          <option value="">{t("search.select_district")}</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {t(`district.${d}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2">
        <Calendar size={18} />
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          placeholderText={t("search.check_in")}
          className="bg-gray-100 rounded-full px-4 py-2 text-sm w-28"
        />
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          placeholderText={t("search.check_out")}
          className="bg-gray-100 rounded-full px-4 py-2 text-sm w-28"
        />
      </div>

      {/* Guests */}
      <div className="flex items-center gap-2">
        <Users size={18} />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={i18n.language === "bn" ? toBanglaNumber(guests) : guests}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, "");
            setGuests(Number(raw));
          }}
          className="bg-gray-100 rounded-full px-4 py-2 text-sm w-16"
        />
      </div>

      {/* Keyword */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={t("search.add_keyword")}
        className="bg-gray-100 rounded-full px-4 py-2 text-sm"
      />

      {/* Mobile drawer toggle */}
      <button
        className="lg:hidden flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 text-sm"
        onClick={() => alert("TODO: open mobile drawer")}
      >
        <SlidersHorizontal size={16} /> {t("search.filters")}
      </button>

      {/* Tags (desktop) */}
      <div className="hidden lg:flex items-center gap-2">
        <Tag size={18} />
        {availableTags.map((tag) => (
          <label key={tag} className="text-xs flex gap-1 items-center">
            <input
              type="checkbox"
              value={tag}
              checked={tags.includes(tag)}
              onChange={() =>
                setTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
              className="accent-rose-500"
            />
            {tag}
          </label>
        ))}
      </div>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-gray-100 rounded-full px-4 py-2 text-sm"
      >
        <option value="">{t("search.default_sort")}</option>
        <option value="priceAsc">{t("search.price_low_high")}</option>
        <option value="priceDesc">{t("search.price_high_low")}</option>
        <option value="rating">{t("search.rating")}</option>
        <option value="popular">{t("search.popular")}</option>
      </select>

      {/* Use My Location */}
      <button
        onClick={detectLocation}
        className="flex items-center gap-1 text-sm px-3 py-2 rounded-full bg-gray-100"
      >
        <Crosshair size={14} /> {t("search.use_location")}
      </button>
      {useGeo && (
        <input
          type="number"
          min={1}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          placeholder="Radius (km)"
          className="bg-gray-100 rounded-full px-4 py-2 text-sm w-24"
        />
      )}

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5 py-2 flex items-center gap-2 text-sm font-medium"
      >
        <Search size={16} /> {t("search.search_btn")}
      </button>
    </div>
  );
};

export default SearchBar;
