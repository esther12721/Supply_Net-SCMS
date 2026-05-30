const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const { protect } = require('../middleware/auth');

// GET all shipments
router.get('/', protect, async (req, res) => {
  try {
    const shipments = await Shipment.find().populate('supplier', 'supplierName supplierCode').sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single shipment
router.get('/:id', protect, async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate('supplier', 'supplierName supplierCode email telephone');
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create shipment
router.post('/', protect, async (req, res) => {
  try {
    const { shipmentNumber, shipmentDate, shipmentStatus, destination, supplier } = req.body;
    if (!shipmentNumber || !shipmentDate || !destination || !supplier)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await Shipment.findOne({ shipmentNumber });
    if (exists) return res.status(400).json({ message: 'Shipment number already exists' });

    const shipment = await Shipment.create({ shipmentNumber, shipmentDate, shipmentStatus, destination, supplier });
    const populated = await Shipment.findById(shipment._id).populate('supplier', 'supplierName supplierCode');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update shipment
router.put('/:id', protect, async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('supplier', 'supplierName supplierCode');
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE shipment
router.delete('/:id', protect, async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
