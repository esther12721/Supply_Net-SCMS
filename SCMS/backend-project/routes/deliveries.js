const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const { protect } = require('../middleware/auth');

// GET all deliveries
router.get('/', protect, async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate({ path: 'shipment', populate: { path: 'supplier', select: 'supplierName supplierCode' } })
      .sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single delivery
router.get('/:id', protect, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate({ path: 'shipment', populate: { path: 'supplier', select: 'supplierName supplierCode' } });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create delivery
router.post('/', protect, async (req, res) => {
  try {
    const { deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipment } = req.body;
    if (!deliveryCode || !deliveryDate || !quantityDelivered || !shipment)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await Delivery.findOne({ deliveryCode });
    if (exists) return res.status(400).json({ message: 'Delivery code already exists' });

    const delivery = await Delivery.create({ deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipment });
    const populated = await Delivery.findById(delivery._id)
      .populate({ path: 'shipment', populate: { path: 'supplier', select: 'supplierName supplierCode' } });
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update delivery
router.put('/:id', protect, async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate({ path: 'shipment', populate: { path: 'supplier', select: 'supplierName supplierCode' } });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE delivery
router.delete('/:id', protect, async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ message: 'Delivery deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
