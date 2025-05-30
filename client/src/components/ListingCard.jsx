import { Link } from "react-router-dom";

const ListingCard = ({ listing }) => {
  return (
    <Link
      to={`/listings/${listing._id}`}
      className="block hover:shadow-lg transition duration-200"
    >
      <div className="border p-4 rounded shadow bg-white h-full">
        <img
          src={listing.images?.[0]}
          alt={listing.title}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="text-lg font-bold mt-2">{listing.title}</h3>
        <p className="text-gray-500">{listing.location?.address}</p>
        <p className="text-green-600 font-semibold">৳{listing.price}/night</p>
      </div>
    </Link>
  );
};

export default ListingCard;
