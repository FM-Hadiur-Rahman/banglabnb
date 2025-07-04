import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminBookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/bookings/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch booking", err);
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <h2 className="text-xl font-bold mb-4">📦 Booking Detail</h2>
      <p>
        <b>ID:</b> {booking._id}
      </p>
      <p>
        <b>Guest:</b> {booking.guestId?.name}
      </p>
      <p>
        <b>Listing:</b> {booking.listingId?.title}
      </p>
      <p>
        <b>Dates:</b> {booking.dateFrom} → {booking.dateTo}
      </p>
      <p>
        <b>Status:</b> {booking.paymentStatus}
      </p>
      <p>
        <b>Amount Paid:</b> {booking.paidAmount}
      </p>
    </AdminLayout>
  );
};

export default AdminBookingDetail;
