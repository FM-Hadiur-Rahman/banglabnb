const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateInvoice = async (booking, listing, guest) => {
  return new Promise((resolve, reject) => {
    const invoiceDir = path.join(__dirname, "../invoices");

    // ✅ Ensure directory exists
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const filePath = path.join(invoiceDir, `invoice-${booking._id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(18).text("BanglaBnB Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Booking ID: ${booking._id}`);
    doc.text(`Guest: ${guest.name} (${guest.email})`);
    doc.text(`Listing: ${listing.title}`);
    doc.text(`Location: ${listing.location?.address}`);
    doc.text(
      `Dates: ${new Date(booking.dateFrom).toDateString()} → ${new Date(
        booking.dateTo
      ).toDateString()}`
    );
    doc.text(`Amount Paid: ৳${booking.paidAmount}`);
    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject); // ✅ handle errors
  });
};

module.exports = generateInvoice;
