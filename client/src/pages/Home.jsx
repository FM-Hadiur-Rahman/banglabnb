// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import mapboxgl, { FullscreenControl } from "mapbox-gl";
// import SearchBar from "../components/SearchBar";
// import ListingCard from "../components/ListingCard";
// import "mapbox-gl/dist/mapbox-gl.css";

// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// const Home = () => {
//   const [listings, setListings] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [hoveredId, setHoveredId] = useState(null);
//   const mapRef = useRef(null);
//   const markersRef = useRef({});
//   const listingRefs = useRef({});
//   // Inside Home.jsx
//   const [activeTab, setActiveTab] = useState("stay");

//   // Fetch listings
//   useEffect(() => {
//     axios.get(`${import.meta.env.VITE_API_URL}/api/listings`).then((res) => {
//       setListings(res.data);
//       setFiltered(res.data);
//     });
//   }, []);

//   // Render map with markers
//   useEffect(() => {
//     if (!mapRef.current || filtered.length === 0) return;

//     const map = new mapboxgl.Map({
//       container: mapRef.current,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [90.4125, 23.8103], // Dhaka
//       zoom: 6,
//     });

//     markersRef.current = {};

//     filtered.forEach((listing) => {
//       const { coordinates } = listing.location || {};
//       if (coordinates?.length === 2) {
//         const el = document.createElement("div");
//         el.className = "marker";
//         el.style.width = "20px";
//         el.style.height = "20px";
//         el.style.borderRadius = "50%";
//         el.style.backgroundColor = "#3b82f6"; // blue
//         el.style.border = "2px solid white";
//         el.style.transition = "transform 0.2s";

//         const marker = new mapboxgl.Marker(el)
//           .setLngLat(coordinates)
//           .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(listing.title))
//           .addTo(map);

//         el.addEventListener("click", () => {
//           const targetRef = listingRefs.current[listing._id];
//           if (targetRef) {
//             targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
//           }
//         });

//         markersRef.current[listing._id] = { marker, element: el };
//       }
//     });

//     return () => map.remove();
//   }, [filtered]);

//   // Update marker on hover
//   useEffect(() => {
//     Object.entries(markersRef.current).forEach(([id, { element }]) => {
//       element.style.transform = id === hoveredId ? "scale(1.5)" : "scale(1)";
//       element.style.backgroundColor = id === hoveredId ? "#facc15" : "#3b82f6"; // yellow highlight
//     });
//   }, [hoveredId]);

//   // Search handler
//   const handleSearch = (query) => {
//     const searchText = query.toLowerCase();
//     const result = listings.filter((l) =>
//       [l.title, l.district, l.division].some((v) =>
//         v?.toLowerCase().includes(searchText)
//       )
//     );
//     setFiltered(result);
//   };

//   return (
//     <div>
//       {/* Hero */}
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

//       <section className="bg-gray-100">
//         <div className="max-w-6xl mx-auto px-4 py-4">
//           <div className="flex justify-center gap-2 sm:gap-4">
//             <button
//               className={`px-4 py-2 rounded-full text-sm sm:text-base ${
//                 activeTab === "stay"
//                   ? "bg-green-600 text-white"
//                   : "bg-white border border-gray-300"
//               }`}
//               onClick={() => setActiveTab("stay")}
//             >
//               🛏️ Stay
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full text-sm sm:text-base ${
//                 activeTab === "ride"
//                   ? "bg-green-600 text-white"
//                   : "bg-white border border-gray-300"
//               }`}
//               onClick={() => setActiveTab("ride")}
//             >
//               🚗 Ride
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Filter / Search */}
//       <section className="py-8 bg-gray-100">
//         <div className="max-w-6xl mx-auto px-4">
//           {activeTab === "stay" ? (
//             <SearchBar onSearch={handleSearch} />
//           ) : (
//             <Link
//               to="/trips"
//               className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
//             >
//               🔍 Find a Ride
//             </Link>
//           )}
//         </div>
//       </section>

//       {/* Map Section (horizontal full-width) */}
//       {activeTab === "stay" && (
//         <>
//           {/* Map Section */}
//           <section className="bg-white">
//             <div className="max-w-7xl mx-auto px-4 pb-8">
//               <div
//                 ref={mapRef}
//                 className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded border border-gray-300"
//               />
//             </div>
//           </section>

//           {/* Listings */}
//           <section className="bg-white py-10">
//             <div className="max-w-7xl mx-auto px-4">
//               <h2 className="text-2xl font-bold mb-6">All Listings</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {Array.isArray(filtered) && filtered.length > 0 ? (
//                   filtered.map((listing) => (
//                     <div
//                       key={listing._id}
//                       ref={(el) => (listingRefs.current[listing._id] = el)}
//                       onMouseEnter={() => setHoveredId(listing._id)}
//                       onMouseLeave={() => setHoveredId(null)}
//                     >
//                       <ListingCard listing={listing} />
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-600 col-span-full">
//                     No listings found.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
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
  const [activeTab, setActiveTab] = useState("stay");

  // Ride tab states
  const [tripFrom, setTripFrom] = useState("");
  const [tripTo, setTripTo] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [rideResults, setRideResults] = useState([]);

  // Fetch listings (Stay)
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/listings`).then((res) => {
      setListings(res.data);
      setFiltered(res.data);
    });
  }, []);

  // Fetch ride trips (Ride)
  const fetchTrips = async () => {
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

  // Map rendering
  useEffect(() => {
    if (!mapRef.current || filtered.length === 0) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [90.4125, 23.8103],
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
        el.style.backgroundColor = "#3b82f6";
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

  // Hover highlight
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, { element }]) => {
      element.style.transform = id === hoveredId ? "scale(1.5)" : "scale(1)";
      element.style.backgroundColor = id === hoveredId ? "#facc15" : "#3b82f6";
    });
  }, [hoveredId]);

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
            Book unique stays or find shared rides with real people.
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

      {/* Tabs */}
      <section className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-center gap-2 sm:gap-4">
            <button
              className={`px-4 py-2 rounded-full text-sm sm:text-base ${
                activeTab === "stay"
                  ? "bg-green-600 text-white"
                  : "bg-white border text-green-600"
              }`}
              onClick={() => setActiveTab("stay")}
            >
              🛏️ Stay
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm sm:text-base ${
                activeTab === "ride"
                  ? "bg-green-600 text-white"
                  : "bg-white border text-green-600"
              }`}
              onClick={() => setActiveTab("ride")}
            >
              🚗 Ride
            </button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          {activeTab === "stay" ? (
            <SearchBar onSearch={handleSearch} />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchTrips();
              }}
              className="space-y-4 bg-white p-4 rounded shadow max-w-md mx-auto"
            >
              <input
                type="text"
                placeholder="From (e.g. Dhaka)"
                value={tripFrom}
                onChange={(e) => setTripFrom(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="To (e.g. Cox’s Bazar)"
                value={tripTo}
                onChange={(e) => setTripTo(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
              >
                🔍 Search Rides
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Ride Results */}
      {activeTab === "ride" && (
        <section className="bg-white py-10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Available Rides</h2>
            {rideResults.length === 0 ? (
              <p>No rides found.</p>
            ) : (
              rideResults.map((trip) => (
                <div
                  key={trip._id}
                  className="border p-4 mb-4 rounded shadow bg-white"
                >
                  <p>
                    <strong>From:</strong> {trip.from}
                  </p>
                  <p>
                    <strong>To:</strong> {trip.to}
                  </p>
                  <p>
                    <strong>Date:</strong> {trip.date.slice(0, 10)}
                  </p>
                  <p>
                    <strong>Time:</strong> {trip.time}
                  </p>
                  <p>
                    <strong>Vehicle:</strong> {trip.vehicleType}
                  </p>
                  <p>
                    <strong>Seats:</strong> {trip.seatsAvailable}
                  </p>
                  <p>
                    <strong>Fare:</strong> ৳{trip.farePerSeat} per seat
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Stay Listings & Map */}
      {activeTab === "stay" && (
        <>
          <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 pb-8">
              <div
                ref={mapRef}
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded border border-gray-300 transition-all duration-300 ease-in-out"
                style={{ minHeight: "350px" }}
              />
            </div>
          </section>

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
                  <p className="text-gray-600 col-span-full">
                    No listings found.
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
