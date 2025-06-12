import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "../components/ListingCard";
import SearchBar from "../components/SearchBar";
import { useSearchParams } from "react-router-dom";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const query = Object.fromEntries([...searchParams.entries()]);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/listings`,
          {
            params: query,
          }
        );

        if (Array.isArray(res.data)) {
          setListings(res.data);
        } else {
          console.warn("⚠️ API did not return an array:", res.data);
          setListings([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch listings:", err);
        setListings([]);
      }
    };

    fetchListings();
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {Array.isArray(listings) && listings.length > 0 ? (
          listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No listings match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
