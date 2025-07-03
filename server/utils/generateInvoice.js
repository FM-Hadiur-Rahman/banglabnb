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

    if (streamTo) {
      doc.pipe(streamTo);
    } else {
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      stream.on("finish", () => {
        resolve(filePath);
        fs.unlink(qrPath, () => {});
      });
      stream.on("error", reject);
    }

    const logoPath = path.join(__dirname, "../assets/banglabnb-logo2.png");
    const banglaFontPath = path.join(
      __dirname,
      "../fonts/NotoSansBengali-VariableFont_wdth,wght.ttf"
    );
    if (fs.existsSync(banglaFontPath))
      doc.registerFont("Bangla", banglaFontPath);

    // Header background
    doc.rect(0, 0, doc.page.width, 100).fill("#34495e");

    // Logo
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 460, 20, {
        fit: [70, 50],
        align: "center",
        valign: "center",
      });
    }

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("white")
      .text("BanglaBnB", 460, 75, { width: 70, align: "center" });

    // Invoice Title
    doc
      .fontSize(14)
      .fillColor("#d21034")
      .text("📄 Booking Invoice", { align: "right", width: 500 });
    doc.moveTo(50, 110).lineTo(550, 110).stroke();

    // Booking details
    const nights = Math.ceil(
      (new Date(booking.dateTo) - new Date(booking.dateFrom)) /
        (1000 * 60 * 60 * 24)
    );
    const baseRate = listing.price || 0;
    const baseTotal = baseRate * nights;
    const serviceFee = baseTotal * 0.1;
    const tax = (baseTotal + serviceFee) * 0.15;
    const total = baseTotal + serviceFee + tax;

    const formatCurrency = (v) =>
      `BDT${Number(v || 0).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    const guests = booking.guests || 1;

    doc.rect(50, 120, 500, 100).fill("#f8f8f8").stroke();
    doc.fillColor("black").font("Helvetica").fontSize(11);
    doc.text(`Booking ID: ${booking._id}`, 60, 130);
    doc.text(`Guest: ${guest.name} (${guest.email})`);
    doc.text(`Listing: ${listing.title}`);
    doc.text(`Address: ${listing.location?.address}`);
    doc.text(
      `Dates: ${new Date(booking.dateFrom).toLocaleDateString()} → ${new Date(
        booking.dateTo
      ).toLocaleDateString()}`
    );
    doc.text(`Status: ${booking.paymentStatus}`);

    // Bangla summary
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

    // Payment Summary
    doc
      .moveDown()
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor("black")
      .text(" Payment Summary", { underline: true });

    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(12);

    const left = 60;
    const width = 500 - left;

    const summaryLines = [
      [
        `Nightly Rate (BDT ${baseRate} x ${nights} nights):`,
        formatCurrency(baseTotal),
      ],
      ["Service Fee (10%):", formatCurrency(serviceFee)],
      ["VAT (15%):", formatCurrency(tax)],
      ["Total Amount Paid:", formatCurrency(total)],
    ];

    summaryLines.forEach(([label, value]) => {
      const isTotal = label.includes("Total");
      const currentY = doc.y;

      doc
        .font(isTotal ? "Helvetica-Bold" : "Helvetica")
        .text(label, left, currentY);

      doc
        .font(isTotal ? "Helvetica-Bold" : "Helvetica")
        .text(value, left, currentY, {
          align: "right",
          width,
        });

      doc.moveDown(0.8);
    });

    // Optional Ride Section
    if (trip) {
      const rideTotal = (trip.farePerSeat || 0) * guests;
      const pickupDate = new Date(trip.date).toLocaleDateString();
      const pickupTime = trip.time || "N/A";

      doc
        .addPage()
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("black")
        .text("Ride Details", { underline: true });

      doc.font("Helvetica").fontSize(12);
      doc.text(`From: ${trip.from}`);
      doc.text(`To: ${trip.to}`);
      doc.text(`Pickup Date: ${pickupDate}`);
      doc.text(`Pickup Time: ${pickupTime}`);
      doc.text(`Vehicle: ${trip.vehicleModel}`);
      doc.text(`License Plate: ${trip.licensePlate || "N/A"}`);
      doc.text(`Fare Per Seat: ${formatCurrency(trip.farePerSeat)}`);
      doc.text(`Seats Reserved: ${guests}`);
      doc.text(`Ride Total: ${formatCurrency(rideTotal)}`);

      doc.moveDown();
      doc.font("Bangla").fontSize(11);
      doc.text(`পিকআপ: ${pickupDate} ${pickupTime}`);
      doc.text(`আসন সংখ্যা: ${guests}`);
      doc.text(`ভাড়া প্রতি আসন: ${formatCurrency(trip.farePerSeat)}`);
    }

    // Invoice metadata
    doc.moveDown(2).font("Helvetica").fontSize(11).fillColor("gray");
    doc.text(`Invoice Number: INV-${booking._id}`, left);
    doc.text(`Issued on: ${new Date().toLocaleDateString("en-GB")}`, left);

    // QR Code
    await QRCode.toFile(
      qrPath,
      `https://banglabnb.com/bookings/${booking._id}`,
      { width: 100 }
    );
    doc.image(qrPath, 450, doc.y - 50, { width: 80 });

    // Signatures
    doc.moveDown(6);
    doc.fontSize(12).fillColor("black");
    const signatureY = doc.y;
    doc.text("__________________________", left, signatureY);
    doc.text("Guest Signature", left, signatureY + 15);
    doc.text("__________________________", 350, signatureY);
    doc.text("Authorized Signature", 350, signatureY + 15);

    // Footer
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
      resolve();
    }
  });
};

module.exports = generateInvoice;
