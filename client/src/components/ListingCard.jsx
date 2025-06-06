import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeart } from "@heroicons/react/24/solid";

const ListingCard = ({ listing }) => {
  const [isSaved, setIsSaved] = useState(false);
  const token = localStorage.getItem("token");

  // Optional: preload wishlist status from local storage or API
  useEffect(() => {
    // You can preload saved listings in a higher-level component
    // and pass a prop like `saved: true` in listing to avoid this
  }, []);

  const toggleWishlist = async (e) => {
    e.preventDefault(); // Prevent <Link> click

    const apiUrl = import.meta.env.VITE_API_URL;
    const url = `${apiUrl}/api/wishlist/${isSaved ? "remove" : "add"}/${
      listing._id
    }`;

    try {
      const response = await fetch(url, {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Wishlist update failed");
      setIsSaved(!isSaved);
    } catch (err) {
      console.error("❌ Wishlist toggle error:", err.message);
    }
  };

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="block hover:shadow-lg transition duration-200 relative group"
    >
      <div className="border p-4 rounded shadow bg-white h-full">
        <div className="relative">
          <img
            src={listing.images?.[0]}
            alt={listing.title}
            className="w-full h-48 object-cover rounded"
          />
          {/* ❤️ Save button */}
          {token && (
            <button
              onClick={toggleWishlist}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            >
              {isSaved ? (
                <SolidHeart className="w-6 h-6 text-red-500" />
              ) : (
                <OutlineHeart className="w-6 h-6 text-gray-600" />
              )}
            </button>
          )}
        </div>

        <h3 className="text-lg font-bold mt-2">{listing.title}</h3>
        <p className="text-gray-500">{listing.location?.address}</p>
        <p className="text-green-600 font-semibold">৳{listing.price}/night</p>
      </div>
    </Link>
  );
};

export default ListingCard;
