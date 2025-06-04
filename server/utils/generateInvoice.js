const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = async (booking, listing, guest) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const filePath = path.join(
      __dirname,
      `../invoices/invoice-${booking._id}.pdf`
    );
    const stream = fs.createWriteStream(filePath);

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
  });
};

module.exports = generateInvoice;
