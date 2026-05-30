const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierCode: { type: String, required: true, unique: true, trim: true },
  supplierName: { type: String, required: true, trim: true },
  telephone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
