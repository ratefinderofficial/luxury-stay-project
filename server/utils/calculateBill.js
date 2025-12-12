const { differenceInCalendarDays } = require('date-fns');

/**
 * Calculate Total Bill
 * @param {Date} checkIn 
 * @param {Date} checkOut 
 * @param {Number} roomPricePerNight 
 * @param {Array} additionalServices - [{ name, price, qty }]
 * @param {Number} taxRate - Percentage (e.g., 10 for 10%)
 */
const calculateBill = (checkIn, checkOut, roomPricePerNight, additionalServices = [], taxRate = 10) => {
    
    // 1. Calculate Nights
    const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    const actualNights = nights === 0 ? 1 : nights; // Minimum 1 night charge

    // 2. Room Cost
    const roomTotal = actualNights * roomPricePerNight;

    // 3. Services Cost
    const servicesTotal = additionalServices.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    }, 0);

    // 4. Subtotal
    const subtotal = roomTotal + servicesTotal;

    // 5. Tax
    const taxAmount = (subtotal * taxRate) / 100;

    // 6. Grand Total
    const totalAmount = subtotal + taxAmount;

    return {
        nights: actualNights,
        roomTotal,
        servicesTotal,
        subtotal,
        taxAmount,
        totalAmount,
        breakdown: {
            roomPrice: roomPricePerNight,
            services: additionalServices
        }
    };
};

module.exports = calculateBill;