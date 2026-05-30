const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentNumber: { type: String, required: true, unique: true, trim: true },
  shipmentDate: { type: Date, required: true },
  shipmentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  destination: { type: String, required: true, trim: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
