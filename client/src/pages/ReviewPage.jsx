// src/pages/ReviewPage.jsx
import { useSearchParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";

const ReviewPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking");
  const listingId = searchParams.get("listing");

  if (!bookingId || !listingId) {
    return (
      <p className="text-red-600 p-4">
        ❌ Missing booking or listing ID in URL
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">✍️ Leave a Review</h1>
      <ReviewForm
        bookingId={bookingId}
        listingId={listingId}
        onSuccess={() => {
          alert("✅ Review submitted!");
          window.location.href = "/dashboard/bookings"; // or go back to bookings
        }}
      />
    </div>
  );
};

export default ReviewPage;
