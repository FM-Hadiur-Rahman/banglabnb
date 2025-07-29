import { useEffect, useState } from "react";
import axios from "axios";

const FeaturedStays = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/featured`)
      .then((res) => setFeatured(res.data))
      .catch((err) => console.error("❌ Failed to load featured stays", err));
  }, []);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">🌟 Popular Places</h3>
      <div className="grid grid-cols-2 gap-4">
        {featured.map((stay) => (
          <div
            key={stay._id}
            className="flex flex-col items-center text-center"
          >
            <img
              src={stay.images?.[0] || "/placeholder.jpg"}
              alt={stay.title}
              className="w-20 h-20 rounded-full object-cover border border-green-400 shadow-sm"
            />
            <span className="mt-2 text-sm font-medium text-gray-700">
              {stay.district}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedStays;
