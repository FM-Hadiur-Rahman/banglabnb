const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const generateInvoice = async (
  booking,
  listing,
  guest,
  streamTo = null,
  trip = null
) => {
  return new Promise(async (resolve, reject) => {
    const invoiceDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoiceDir))
      fs.mkdirSync(invoiceDir, { recursive: true });

    const filePath = path.join(invoiceDir, `invoice-${booking._id}.pdf`);
    const qrPath = path.join(invoiceDir, `qr-${booking._id}.png`);
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // 🔀 Pipe based on context
    if (streamTo) {
      doc.pipe(streamTo); // ✅ stream to browser
    } else {
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      stream.on("finish", () => {
        resolve(filePath);
        fs.unlink(qrPath, () => {});
      });
      stream.on("error", reject);
    }

    // Load resources
    const logoPath = path.join(__dirname, "../assets/banglabnb-logo.png");
    const banglaFontPath = path.join(
      __dirname,
      "../fonts/NotoSansBengali-VariableFont_wdth,wght.ttf"
    );
    if (fs.existsSync(banglaFontPath))
      doc.registerFont("Bangla", banglaFontPath);

    // 🟩 Header
    doc.rect(0, 0, doc.page.width, 100).fill("#e6f2f0");
    if (fs.existsSync(logoPath)) doc.image(logoPath, 50, 30, { width: 80 });
    doc
      .fillColor("#006a4e")
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("BanglaBnB", 0, 40, { align: "right", width: 500 });
    doc
      .fontSize(14)
      .fillColor("#d21034")
      .text("📄 Booking Invoice", { align: "right", width: 500 });
    doc.moveTo(50, 110).lineTo(550, 110).stroke();

    // 🧾 Booking Info
    const nights = Math.ceil(
      (new Date(booking.dateTo) - new Date(booking.dateFrom)) /
        (1000 * 60 * 60 * 24)
    );
    const baseRate = listing.price;
    const baseTotal = baseRate * nights;
    const serviceFee = baseTotal * 0.1;
    const tax = (baseTotal + serviceFee) * 0.1;
    const total = baseTotal + serviceFee + tax;

    const formatCurrency = (v) => `BDT${v.toFixed(2)}`;
    doc.rect(50, 120, 500, 100).fill("#f8f8f8").stroke();
    doc.fillColor("black").font("Helvetica").fontSize(11);
    let top = 130;
    doc.text(`Booking ID: ${booking._id}`, 60, top);
    doc.text(`Guest: ${guest.name} (${guest.email})`);
    doc.text(`Listing: ${listing.title}`);
    doc.text(`Address: ${listing.location?.address}`);
    doc.text(
      `Dates: ${new Date(booking.dateFrom).toLocaleDateString()} → ${new Date(
        booking.dateTo
      ).toLocaleDateString()}`
    );
    doc.text(`Status: ${booking.paymentStatus}`);

    // 🌐 Bangla Summary
    doc.moveDown();
    doc.font("Bangla").fontSize(11).fillColor("#333");
    doc.text(`অতিথি: ${guest.name}`);
    doc.text(`মেইল: ${guest.email}`);
    doc.text(`অবস্থান: ${listing.location?.address}`);
    doc.text(
      `তারিখ: ${new Date(booking.dateFrom).toLocaleDateString()} → ${new Date(
        booking.dateTo
      ).toLocaleDateString()}`
    );

    // 💰 Payment Breakdown
    doc
      .moveDown()
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor("black")
      .text(" Payment Summary", { underline: true });
    doc.font("Helvetica").fontSize(12);
    const left = 60;
    const right = 500;
    doc.text(`Nightly Rate (BDT${baseRate} x ${nights} nights):`, left, doc.y);
    doc.text(formatCurrency(baseTotal), right, doc.y, { align: "right" });
    doc.text("Service Fee (10%):", left);
    doc.text(formatCurrency(serviceFee), right, doc.y, { align: "right" });
    doc.text("VAT (10%):", left);
    doc.text(formatCurrency(tax), right, doc.y, { align: "right" });
    doc.font("Helvetica-Bold").text("Total Amount Paid:", left);
    doc.text(formatCurrency(total), right, doc.y, { align: "right" });

    // 🚗 Ride Details (if available)
    if (trip) {
      const rideTotal = trip.farePerSeat * booking.guests;
      const pickupDate = new Date(trip.date).toLocaleDateString();
      const pickupTime = trip.time || "N/A";

      doc
        .addPage()
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("black")
        .text("🚗 Ride Details", { underline: true });

      doc.font("Helvetica").fontSize(12);
      doc.text(`From: ${trip.from}`);
      doc.text(`To: ${trip.to}`);
      doc.text(`Pickup Date: ${pickupDate}`);
      doc.text(`Pickup Time: ${pickupTime}`);
      doc.text(`Vehicle: ${trip.vehicleModel}`);
      doc.text(`License Plate: ${trip.licensePlate || "N/A"}`);
      doc.text(`Fare Per Seat: ৳${trip.farePerSeat}`);
      doc.text(`Seats Reserved: ${booking.guests}`);
      doc.text(`Ride Total: ৳${rideTotal}`);

      // Bangla section
      doc.moveDown();
      doc.font("Bangla").fontSize(11);
      doc.text(`পিকআপ: ${pickupDate} ${pickupTime}`);
      doc.text(`ভাড়া প্রতি আসন: ৳${trip.farePerSeat}`);
    }

    // 📅 Metadata
    doc.moveDown(2).font("Helvetica").fontSize(11).fillColor("gray");
    doc.text(`Invoice Number: INV-${booking._id}`, left);
    doc.text(`Issued on: ${new Date().toLocaleDateString("en-GB")}`, left);

    // 🖨 QR Code
    await QRCode.toFile(
      qrPath,
      `https://banglabnb.com/bookings/${booking._id}`,
      { width: 100 }
    );
    doc.image(qrPath, 450, doc.y - 50, { width: 80 });

    // ✍ Signatures
    doc.moveDown(6);
    doc.fontSize(12).fillColor("black");
    const signatureY = doc.y;
    doc.text("__________________________", left, signatureY);
    doc.text("Guest Signature", left, signatureY + 15);
    doc.text("__________________________", 350, signatureY);
    doc.text("Authorized Signature", 350, signatureY + 15);

    // 🔻 Footer
    doc.rect(0, 760, doc.page.width, 40).fill("#f0f0f0");
    doc
      .fillColor("gray")
      .fontSize(10)
      .text("This invoice was generated by BanglaBnB", 50, 775, {
        align: "center",
      });

    doc.end();
    if (streamTo) {
      fs.unlink(qrPath, () => {});
      resolve(); // ✅ finish for browser streaming
    }
  });
};

module.exports = generateInvoice;
