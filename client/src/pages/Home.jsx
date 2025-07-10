import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import ListingCard from "../components/ListingCard";
import RideSearchForm from "../components/RideSearchForm";
import RideResults from "../components/RideResults";
import "mapbox-gl/dist/mapbox-gl.css";
import MapSection from "../components/MapSection";
import { toast } from "react-toastify";
import { initiateTripPayment } from "../utils/initiateTripPayment";
import HeroBanner from "../components/HeroBanner";

const Home = () => {
  const [activeTab, setActiveTab] = useState("stay");
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [rideResults, setRideResults] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const listingRefs = useRef({});

  // Trip search filters
  const [tripFrom, setTripFrom] = useState("");
  const [tripTo, setTripTo] = useState("");
  const [tripDate, setTripDate] = useState("");
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // On mount: redirect to /listings (no filters) if user navigated to /listings?guests=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("guests") === "1" && params.get("page") === "1") {
      window.history.replaceState({}, "", "/listings");
    }
  }, []);

  useEffect(() => {
    if (activeTab === "stay") {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/listings`, {
          params: {
            page: currentPage,
            limit: 12,
          },
        })
        .then((res) => {
          setListings(res.data.listings);
          setFiltered(res.data.listings);
          setTotalPages(res.data.totalPages || 1);
        });
    } else {
      axios.get(`${import.meta.env.VITE_API_URL}/api/trips`).then((res) => {
        setRideResults(res.data);
      });
    }
  }, [activeTab, currentPage]);

  const handleSearch = (query) => {
    const searchText = query.toLowerCase();
    const result = listings.filter((l) =>
      [l.title, l.district, l.division].some((v) =>
        v?.toLowerCase().includes(searchText)
      )
    );
    setFiltered(result);
  };

  const handleTripSearch = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips`);
      const filtered = res.data.filter((trip) => {
        return (
          (!tripFrom ||
            trip.from.toLowerCase().includes(tripFrom.toLowerCase())) &&
          (!tripTo || trip.to.toLowerCase().includes(tripTo.toLowerCase())) &&
          (!tripDate || trip.date.startsWith(tripDate))
        );
      });
      setRideResults(filtered);
    } catch (err) {
      console.error("❌ Failed to fetch rides", err);
    }
  };
  const handleReserveSeat = async (trip, seatCount = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must be logged in to reserve a ride");

    try {
      const paymentUrl = await initiateTripPayment({
        tripId: trip._id,
        seats: seatCount,
        token,
      });

      if (paymentUrl) {
        toast.success("✅ Redirecting to payment...");
        window.location.href = paymentUrl;
      } else {
        toast.error("Payment initiation failed");
      }
    } catch (err) {
      console.error("❌ Payment initiation error:", err);
      toast.error(err?.response?.data?.message || "Failed to initiate payment");
    }
  };
  const cancelReservation = async (tripId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/cancel`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("❌ Reservation cancelled");
      // Optionally refresh
    } catch (err) {
      console.error("❌ Cancel failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to cancel reservation"
      );
    }
  };

  return (
    <div>
      {/* Hero */}

      <HeroBanner activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Search Section */}
      <section className="py-8 bg-gray-100">
        <div className="w-full mx-auto px-0">
          <div className="bg-white rounded-xl shadow-md p-6">
            {activeTab === "stay" ? (
              <SearchBar onSearch={handleSearch} />
            ) : (
              <RideSearchForm
                tripFrom={tripFrom}
                tripTo={tripTo}
                tripDate={tripDate}
                setTripFrom={setTripFrom}
                setTripTo={setTripTo}
                setTripDate={setTripDate}
                handleTripSearch={handleTripSearch}
                onResults={setRideResults}
                onCancel={cancelReservation}
              />
            )}
          </div>
        </div>
      </section>
      {/* Map */}
      {(filtered.length > 0 || rideResults.length > 0) && (
        <MapSection
          items={activeTab === "stay" ? filtered : rideResults}
          activeTab={activeTab}
          hoveredId={hoveredId}
          listingRefs={listingRefs}
        />
      )}
      {/* Ride Results */}
      {activeTab === "ride" && (
        <RideResults trips={rideResults} onReserve={handleReserveSeat} />
      )}

      {/* Listings */}
      {activeTab === "stay" && (
        <section className="bg-white py-10">
          <div className="w-full mx-auto px-0">
            <h2 className="text-2xl font-bold ml-4 mb-6">All Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length > 0 ? (
                filtered.map((listing) => (
                  <div
                    key={listing._id}
                    ref={(el) => (listingRefs.current[listing._id] = el)}
                    onMouseEnter={() => setHoveredId(listing._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <ListingCard listing={listing} />
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full">
                  No listings found.
                </p>
              )}
            </div>
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2 text-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                ⬅ Prev
              </button>

              {Array.from({ length: totalPages }, (_, idx) => {
                const page = idx + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Next ➡
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
