const generateInvoice = require("../utils/generateInvoice");
const mongoose = require("mongoose");

(async () => {
  try {
    // ✅ Fake/mock data
    const booking = {
      _id: "demo1234567890",
      dateFrom: new Date("2025-07-20"),
      dateTo: new Date("2025-07-23"),
      guests: 2,
      paymentStatus: "paid",
    };

    const listing = {
      title: "Test Beach Villa",
      price: 3500,
      location: {
        address: "Cox's Bazar, Bangladesh",
      },
    };

    const guest = {
      name: "Hadiur Rahman",
      email: "guest@example.com",
      address: "Dhaka",
      phone: "01700000000",
    };

    const trip = {
      from: "Dhaka",
      to: "Cox's Bazar",
      date: new Date("2025-07-20"),
      time: "7:00 AM",
      vehicleModel: "Toyota HiAce",
      licensePlate: "DHA-12345",
      farePerSeat: 1200,
    };

    // 🧾 Generate PDF (locally saved)
    const filePath = await generateInvoice(booking, listing, guest, null, trip);
    console.log("✅ Invoice generated at:", filePath);
  } catch (err) {
    console.error("❌ Test invoice generation failed:", err);
  } finally {
    mongoose.disconnect();
  }
})();
