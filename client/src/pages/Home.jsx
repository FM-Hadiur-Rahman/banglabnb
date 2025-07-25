import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import ListingCard from "../components/ListingCard";
import MapSection from "../components/MapSection";
import HeroBanner from "../components/HeroBanner";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const listingRefs = useRef({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("guests") === "1" && params.get("page") === "1") {
      window.history.replaceState({}, "", "/listings");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings`, {
        params: { page: currentPage, limit: 12 },
      })
      .then((res) => {
        setListings(res.data.listings);
        setFiltered(res.data.listings);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error("❌ Failed to fetch listings", err));
  }, [currentPage]);

  const handleSearch = (query) => {
    const searchText = query.toLowerCase();
    const result = listings.filter((l) =>
      [l.title, l.district, l.division].some((v) =>
        v?.toLowerCase().includes(searchText)
      )
    );
    setFiltered(result);
  };

  return (
    <div>
      <HeroBanner />

      <section className="py-8 bg-gray-100">
        <div className="w-full mx-auto px-0">
          <div className="bg-white rounded-xl shadow-md p-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {filtered.length > 0 && (
        <MapSection
          items={filtered}
          activeTab="stay"
          hoveredId={hoveredId}
          listingRefs={listingRefs}
        />
      )}

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
              <p className="text-gray-600 col-span-full">No listings found.</p>
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
    </div>
  );
};

export default Home;
