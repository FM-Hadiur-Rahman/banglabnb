const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const generateTripInvoice = async (reservation, trip, user) => {
  const invoiceDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

  const filePath = path.join(invoiceDir, `trip-invoice-${reservation._id}.pdf`);
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  // ✅ Watermark (simple text)
  doc
    .fontSize(60)
    .fillColor("gray")
    .opacity(0.2)
    .rotate(45, { origin: [250, 300] })
    .text("BanglaBnB", 100, 150);
  doc.rotate(-45).opacity(1); // reset

  // ✅ Header
  doc.image(path.join(__dirname, "../assets/banglabnb-logo.png"), 50, 40, {
    width: 100,
  });
  doc
    .fontSize(18)
    .fillColor("black")
    .text("🧾 Trip Reservation Invoice", 200, 50);

  // ✅ Reservation details
  doc.fontSize(12).moveDown().text(`Invoice ID: ${reservation._id}`);
  doc.text(`Passenger: ${user.name}`);
  doc.text(`Trip: ${trip.from} ➡ ${trip.to}`);
  doc.text(`Date: ${trip.date}`);
  doc.text(`Time: ${trip.time}`);
  doc.text(`Seats Reserved: ${reservation.seats}`);
  doc.text(`Total Paid: ৳${reservation.amount}`);

  // ✅ QR Code with trip info link
  const qrData = `Trip ID: ${trip._id}, Reservation ID: ${reservation._id}, Amount: ৳${reservation.amount}`;
  const qrImage = await QRCode.toDataURL(qrData);
  doc.image(qrImage, 400, 250, { width: 100 });

  doc.end();
  return filePath;
};

module.exports = generateTripInvoice;
