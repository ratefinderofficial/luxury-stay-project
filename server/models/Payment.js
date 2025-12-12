const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    paymentMethod: { 
        type: String, 
        enum: ['Credit Card', 'Debit Card', 'Cash', 'Stripe', 'PayPal'], 
        required: true 
    },
    transactionId: { type: String }, // Stripe ID
    status: { 
        type: String, 
        enum: ['Success', 'Failed', 'Pending'], 
        default: 'Success' 
    },
    paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);