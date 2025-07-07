// ListingDetailPage.safe.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../components/BookingForm";
import ReviewList from "../components/ReviewList";
import RideResults from "../components/RideResults";
import { formatBanglaNumber } from "../utils/formatBanglaNumber";

import { useTranslation } from "react-i18next";

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [suggestedTrips, setSuggestedTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [bookingMode, setBookingMode] = useState("stay");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error("Failed to load listing:", err));
  }, [id]);

  useEffect(() => {
    if (!listing?.district) return;

    setLoadingTrips(true);

    const isDev = true;
    if (isDev) {
      const latitude = 23.8103;
      const longitude = 90.4125;

      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/trips/suggestions?to=${
            listing.district
          }&lat=${latitude}&lng=${longitude}`
        )
        .then((res) => setSuggestedTrips(res.data))
        .catch((err) => console.error("❌ Trip suggestion fetch error", err))
        .finally(() => setLoadingTrips(false));
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          axios
            .get(
              `${import.meta.env.VITE_API_URL}/api/trips/suggestions?to=${
                listing.district
              }&lat=${latitude}&lng=${longitude}`
            )
            .then((res) => setSuggestedTrips(res.data))
            .catch((err) =>
              console.error("❌ Trip suggestion fetch error", err)
            )
            .finally(() => setLoadingTrips(false));
        },
        (err) => {
          console.error("❌ Geolocation failed:", err);
          setLoadingTrips(false);
        }
      );
    }
  }, [listing]);

  if (!listing) return <p className="text-center">{t("loading")}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Array.isArray(listing.images) &&
            listing.images.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-52 object-cover rounded cursor-pointer hover:opacity-90 transition-transform hover:scale-105"
                  onClick={() => setSelectedImage(url)}
                />
                {idx === 0 && listing.host?.premium?.isActive && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
                    🌟 Premium
                  </span>
                )}
              </div>
            ))}

          {/* Always show map as last item */}
          <div className="w-full h-52 col-span-2 md:col-span-1 rounded overflow-hidden">
            <iframe
              title="Listing Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${listing.location?.coordinates[1]},${listing.location?.coordinates[0]}&z=15&output=embed`}
            ></iframe>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          {/* <p className="text-gray-600 mt-1">{listing.location?.address}</p> */}
          <p className="text-gray-600 mt-1">
            {t(`district.${listing.district}`)},{" "}
            {t(`division.${listing.division}`)}
          </p>

          <p className="text-green-600 font-bold text-lg">
            {t("price_per_night", {
              price:
                i18n.language === "bn"
                  ? formatBanglaNumber(listing.price)
                  : listing.price,
            })}
          </p>
          <p className="mt-4 text-gray-700">
            {t("guests_supported", {
              count:
                i18n.language === "bn"
                  ? formatBanglaNumber(listing.maxGuests)
                  : listing.maxGuests,
            })}
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setBookingMode("stay")}
            className={`px-4 py-1 rounded border ${
              bookingMode === "stay" ? "bg-green-600 text-white" : "bg-gray-100"
            }`}
          >
            🛏️ {t("stay_only")}
          </button>
          <button
            onClick={() => setBookingMode("combined")}
            className={`px-4 py-1 rounded border ${
              bookingMode === "combined"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            🛏️+🚗 {t("stay_and_ride")}
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              📝 {t("description")}
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {listing.houseRules && (
            <div>
              <h2 className="text-xl font-semibold mb-1">
                📜 {t("house_rules")}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {listing.houseRules}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <ReviewList listingId={listing._id} />
        </div>
        <div className="mt-10 border-t pt-6">
          {loadingTrips ? (
            <p className="text-center text-gray-500 mt-6">
              {t("loading_rides")}
            </p>
          ) : suggestedTrips.length > 0 ? (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t("suggested_rides")}
              </h3>
              <RideResults
                trips={suggestedTrips}
                selectedTrip={selectedTrip}
                onSelectTrip={setSelectedTrip}
              />
            </>
          ) : (
            <p className="text-center text-gray-400 mt-6 italic">
              {t("no_rides_found")}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-md h-fit sticky top-20">
        <BookingForm
          listingId={listing._id}
          price={listing.price}
          maxGuests={listing.maxGuests}
          blockedDates={listing.blockedDates || []}
          bookingMode={bookingMode}
          selectedTrip={selectedTrip}
        />
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Full preview"
              className="w-full h-auto rounded shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
