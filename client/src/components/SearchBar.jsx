import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "react-datepicker/dist/react-datepicker.css";
import { divisions } from "../data/districts";

const SearchBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const districts = division ? divisions[division] : [];
  const toBanglaNumber = (number) => {
    const enToBn = {
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
    return number
      .toString()
      .split("")
      .map((d) => enToBn[d] || d)
      .join("");
  };

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
        <label className="text-sm font-semibold">{t("search.division")}</label>
        <select
          value={division}
          onChange={(e) => {
            setDivision(e.target.value);
            setDistrict(""); // reset district
          }}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">{t("search.select_division")}</option>
          {Object.keys(divisions).map((div) => (
            <option key={div} value={div}>
              {t(`division.${div}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-semibold">{t("search.district")}</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">{t("search.select_district")}</option>
          {districts.map((dist) => (
            <option key={dist} value={dist}>
              {t(`district.${dist}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-semibold">{t("search.check_in")}</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          placeholderText={t("search.add_date")}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-semibold">{t("search.check_out")}</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          placeholderText={t("search.add_date")}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex-1 min-w-[100px]">
        <label className="text-sm font-semibold">{t("search.guests")}</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={i18n.language === "bn" ? toBanglaNumber(guests) : guests}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, "");
            setGuests(Number(raw));
          }}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded font-semibold"
      >
        {t("search.search_btn")}
      </button>
    </div>
  );
};

export default SearchBar;
