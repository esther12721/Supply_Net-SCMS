const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryCode: { type: String, required: true, unique: true, trim: true },
  deliveryDate: { type: Date, required: true },
  quantityDelivered: { type: Number, required: true, min: 1 },
  deliveryStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Partial', 'Complete', 'Failed'],
    default: 'Pending'
  },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
