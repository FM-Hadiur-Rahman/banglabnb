const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = async (booking, listing, guest) => {
  return new Promise((resolve, reject) => {
    const invoicesDir = path.join(__dirname, "../invoices");

    // ✅ Ensure directory exists
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.join(invoicesDir, `invoice-${booking._id}.pdf`);
    const stream = fs.createWriteStream(filePath);

    const doc = new PDFDocument();

    doc.pipe(stream);

    doc.fontSize(18).text("BanglaBnB Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Booking ID: ${booking._id}`);
    doc.text(`Guest: ${guest.name} (${guest.email})`);
    doc.text(`Listing: ${listing.title}`);
    doc.text(`Location: ${listing.location?.address}`);
    doc.text(
      `Dates: ${new Date(booking.dateFrom).toDateString()} to ${new Date(
        booking.dateTo
      ).toDateString()}`
    );
    doc.text(`Amount Paid: ৳${booking.paidAmount}`);
    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", (err) => {
      reject(err); // Reject on stream failure
    });
  });
};

module.exports = generateInvoice;
