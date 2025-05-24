import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ListingCard from "../components/ListingCard";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/listings`).then((res) => {
      setListings(res.data);
      setFiltered(res.data);
    });
  }, []);

  const handleSearch = (query) => {
    const result = listings.filter((l) => {
      const searchText = query.toLowerCase();
      return (
        l.title.toLowerCase().includes(searchText) ||
        l.location.toLowerCase().includes(searchText) ||
        l.price.toString().includes(searchText)
      );
    });
    setFiltered(result);
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="h-[70vh] bg-cover bg-center flex items-center justify-center text-white text-center relative"
        style={{
          backgroundImage: "url('/alex-diaz-2miUDyd05TY-unsplash.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Experience Bangladesh Like Never Before
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Book unique stays hosted by real people, not hotels.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
            >
              Become a Host
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-green-700 px-6 py-3 rounded"
            >
              Find a Stay
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Listings */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Listings</h2>

          {/* Search bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Listings grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                No listings found.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
