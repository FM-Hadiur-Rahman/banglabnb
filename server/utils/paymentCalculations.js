// utils/paymentCalculations.js

exports.calculateStayPayment = ({ pricePerNight, nights }) => {
  const subtotal = pricePerNight * nights;
  const guestFee = Math.round(subtotal * 0.1);
  const hostFee = Math.round((subtotal - guestFee) * 0.05);
  const vat = Math.round((guestFee + hostFee) * 0.15);
  const total = subtotal + guestFee;
  const hostPayout = subtotal - hostFee;

  return {
    subtotal,
    guestFee,
    hostFee,
    vat,
    total,
    hostPayout,
  };
};

exports.calculateTripPayment = ({ farePerSeat, seats }) => {
  const subtotal = farePerSeat * seats;
  const serviceFee = Math.round(subtotal * 0.1);
  const vat = Math.round(serviceFee * 0.15);
  const total = subtotal + serviceFee;
  const driverPayout = subtotal - serviceFee;

  return {
    subtotal,
    serviceFee,
    vat,
    total,
    driverPayout,
  };
};

exports.calculateCombinedPayment = ({ staySubtotal, tripSubtotal }) => {
  const combinedSubtotal = staySubtotal + tripSubtotal;

  const guestFee = Math.round(combinedSubtotal * 0.1);
  const hostFee = Math.round(staySubtotal * 0.05);
  const serviceFee = Math.round(tripSubtotal * 0.1);

  const totalRevenue = guestFee + hostFee + serviceFee;
  const vat = Math.round(totalRevenue * 0.15);

  const total = combinedSubtotal + guestFee + serviceFee;

  const hostPayout = staySubtotal - hostFee;
  const driverPayout = tripSubtotal - serviceFee;

  return {
    combinedSubtotal,
    guestFee,
    hostFee,
    serviceFee,
    vat,
    total,
    hostPayout,
    driverPayout,
  };
};

exports.calculatePremiumUpgrade = () => {
  const price = 499;
  const platformFee = 499; // Full goes to platform
  const vat = Math.round(platformFee * 0.15); // Optional, for record
  const payout = 0;

  return {
    price,
    platformFee,
    vat,
    payout,
  };
};
