import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import ListingCard from "../components/ListingCard";
import MapSection from "../components/MapSection";
import HeroBanner from "../components/HeroBanner";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

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

  const handleSearch = (query = "", filters = selectedFilters) => {
    const searchText = query.toLowerCase();

    const result = listings.filter((l) => {
      const matchesText = [l.title, l.district, l.division].some((v) =>
        v?.toLowerCase().includes(searchText)
      );

      const matchesFilters =
        filters.length === 0 ||
        filters.every((f) =>
          l.tags?.map((t) => t.toLowerCase()).includes(f.toLowerCase())
        );

      return matchesText && matchesFilters;
    });

    setFiltered(result);
  };

  return (
    <>
      <HeroBanner />

      <section className="py-8 bg-gray-100">
        <div className="w-full mx-auto px-0">
          <div className="bg-white rounded-xl shadow-md p-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-green-200 bg-white">
        <div className="whitespace-nowrap py-3">
          <div className="inline-block animate-marquee text-green-800 font-semibold text-lg tracking-wide px-6">
            🌾 Stay Local, Feel Bangladesh. &nbsp;&nbsp;|&nbsp;&nbsp; 🏡 Not
            Just a Stay. A Cultural Journey. &nbsp;&nbsp;|&nbsp;&nbsp; 🌿 From
            Clay Houses to Bamboo Huts — BanglaBnB Welcomes You.
            &nbsp;&nbsp;|&nbsp;&nbsp; 💚 Live Rural. Travel Real. Stay with
            BanglaBnB. &nbsp;&nbsp;|&nbsp;&nbsp; 🌊 Explore Rivers & Villages.
            &nbsp;&nbsp;|&nbsp;&nbsp; 🛖 Wooden Walls, Warm Smiles.
            &nbsp;&nbsp;|&nbsp;&nbsp; ✨ Rediscover Hospitality — The
            Bangladeshi Way. &nbsp;&nbsp;|&nbsp;&nbsp; 📍 Your Home in Every
            Village. &nbsp;&nbsp;|&nbsp;&nbsp; 🎒 Unplug from Routine. Plug into
            Bengal. &nbsp;&nbsp;|&nbsp;&nbsp; 🌟 BanglaBnB – Not just a stay, a
            story 🇧🇩
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
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-10">
        {/* Sidebar (visible only on large screens) */}
        <Sidebar
          selectedFilters={selectedFilters}
          onFilterChange={(filters) => {
            setSelectedFilters(filters);
            handleSearch("", filters);
          }}
        />

        {/* Main content */}
        <div className="flex-grow">
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
      </div>
    </>
  );
};

export default Home;
