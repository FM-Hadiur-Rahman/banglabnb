// // 📁 src/pages/ListingDetailPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import BookingForm from "../components/BookingForm";

// const ListingDetailPage = () => {
//   const { id } = useParams();
//   const [listing, setListing] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
//       .then((res) => setListing(res.data))
//       .catch((err) => console.error("Failed to load listing:", err));
//   }, [id]);

//   if (!listing) return <p className="text-center">Loading listing...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
//       {listing.images?.map((url, idx) => (
//         <img
//           key={idx}
//           src={url}
//           alt={`Image ${idx + 1}`}
//           className="w-full h-64 object-cover rounded mb-4"
//         />
//       ))}

//       <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
//       <p className="text-gray-600 mb-1">{listing.location?.address}</p>
//       <p className="text-green-700 font-semibold text-lg mb-4">
//         ৳{listing.price} / night
//       </p>

//       <h2 className="text-xl font-bold mb-2">Book this stay</h2>
//       <BookingForm listingId={listing._id} />
//     </div>
//   );
// };

// export default ListingDetailPage;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../components/BookingForm";

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error("Failed to load listing:", err));
  }, [id]);

  if (!listing) return <p className="text-center">Loading listing...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Image Gallery and Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {listing.images?.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Image ${idx + 1}`}
              className="w-full h-52 object-cover rounded"
            />
          ))}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-gray-600 mt-1">{listing.location?.address}</p>
          <p className="text-green-600 font-bold text-lg">
            ৳{listing.price} / night
          </p>
          <p className="mt-4 text-gray-700">
            This cozy place can host up to {listing.maxGuests} guests.
          </p>
        </div>
      </div>

      {/* Right: Booking Box */}
      <div className="bg-white border rounded-lg p-6 shadow-md h-fit sticky top-20">
        <BookingForm
          listingId={listing._id}
          price={listing.price}
          maxGuests={listing.maxGuests}
        />
      </div>
    </div>
  );
};

export default ListingDetailPage;
