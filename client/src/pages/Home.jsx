// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import SearchBar from "../components/SearchBar";
// import ListingCard from "../components/ListingCard";

// const Home = () => {
//   const [listings, setListings] = useState([]);
//   const [filtered, setFiltered] = useState([]);

//   useEffect(() => {
//     axios.get(`${import.meta.env.VITE_API_URL}/api/listings`).then((res) => {
//       setListings(res.data);
//       setFiltered(res.data);
//     });
//   }, []);

//   const handleSearch = (query) => {
//     const result = listings.filter((l) => {
//       const searchText = query.toLowerCase();
//       return (
//         l.title.toLowerCase().includes(searchText) ||
//         l.location.toLowerCase().includes(searchText) ||
//         l.price.toString().includes(searchText)
//       );
//     });
//     setFiltered(result);
//   };

//   return (
//     <div>
//       {/* Hero Section */}
//       <div
//         className="h-[70vh] bg-cover bg-center flex items-center justify-center text-white text-center relative"
//         style={{
//           backgroundImage: "url('/alex-diaz-2miUDyd05TY-unsplash.jpg')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//         <div className="z-10 px-4">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">
//             Experience Bangladesh Like Never Before
//           </h1>
//           <p className="text-lg md:text-xl mb-6">
//             Book unique stays hosted by real people, not hotels.
//           </p>
//           <div className="space-x-4">
//             <Link
//               to="/register"
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
//             >
//               Become a Host
//             </Link>
//             <Link
//               to="/login"
//               className="bg-white hover:bg-gray-100 text-green-700 px-6 py-3 rounded"
//             >
//               Find a Stay
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Search and Listings */}
//       <section className="py-12 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-2xl font-bold mb-6">Featured Listings</h2>

//           {/* Search bar */}
//           <SearchBar onSearch={handleSearch} />

//           {/* Listings grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {filtered.length > 0 ? (
//               filtered.map((listing) => (
//                 <ListingCard key={listing._id} listing={listing} />
//               ))
//             ) : (
//               <p className="text-gray-600 col-span-full text-center">
//                 No listings found.
//               </p>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import mapboxgl, { FullscreenControl } from "mapbox-gl";
import SearchBar from "../components/SearchBar";
import ListingCard from "../components/ListingCard";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const listingRefs = useRef({});

  // Fetch listings
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/listings`).then((res) => {
      setListings(res.data);
      setFiltered(res.data);
    });
  }, []);

  // Render map with markers
  useEffect(() => {
    if (!mapRef.current || filtered.length === 0) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [90.4125, 23.8103], // Dhaka
      zoom: 6,
    });

    markersRef.current = {};

    filtered.forEach((listing) => {
      const { coordinates } = listing.location || {};
      if (coordinates?.length === 2) {
        const el = document.createElement("div");
        el.className = "marker";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#3b82f6"; // blue
        el.style.border = "2px solid white";
        el.style.transition = "transform 0.2s";

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(listing.title))
          .addTo(map);

        el.addEventListener("click", () => {
          const targetRef = listingRefs.current[listing._id];
          if (targetRef) {
            targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });

        markersRef.current[listing._id] = { marker, element: el };
      }
    });

    return () => map.remove();
  }, [filtered]);

  // Update marker on hover
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, { element }]) => {
      element.style.transform = id === hoveredId ? "scale(1.5)" : "scale(1)";
      element.style.backgroundColor = id === hoveredId ? "#facc15" : "#3b82f6"; // yellow highlight
    });
  }, [hoveredId]);

  // Search handler
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
      {/* Hero */}
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

      {/* Filter / Search */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Map Section (horizontal full-width) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div
            ref={mapRef}
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded border border-gray-300 transition-all duration-300 ease-in-out"
            style={{ minHeight: "350px" }}
          />
        </div>
      </section>

      {/* Listings */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">All Listings</h2>
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
              <p className="text-gray-600">No listings found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
