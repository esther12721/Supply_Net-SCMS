const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Shipment = require('../models/Shipment');
const Delivery = require('../models/Delivery');
const { protect } = require('../middleware/auth');

const getDateRange = (type) => {
  const now = new Date();
  let start;
  if (type === 'daily') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (type === 'weekly') {
    const day = now.getDay();
    start = new Date(now);
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
  } else if (type === 'monthly') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(0);
  }
  return { start, end: now };
};

// GET summary report
router.get('/summary', protect, async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    const { start, end } = getDateRange(type);

    const dateFilter = type !== 'all' ? { createdAt: { $gte: start, $lte: end } } : {};

    const [totalSuppliers, totalShipments, totalDeliveries, shipmentsByStatus, deliveriesByStatus, recentShipments, recentDeliveries] = await Promise.all([
      Supplier.countDocuments(dateFilter),
      Shipment.countDocuments(dateFilter),
      Delivery.countDocuments(dateFilter),
      Shipment.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$shipmentStatus', count: { $sum: 1 } } }
      ]),
      Delivery.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$deliveryStatus', count: { $sum: 1 } } }
      ]),
      Shipment.find(dateFilter).populate('supplier', 'supplierName supplierCode').sort({ createdAt: -1 }).limit(10),
      Delivery.find(dateFilter)
        .populate({ path: 'shipment', populate: { path: 'supplier', select: 'supplierName' } })
        .sort({ createdAt: -1 }).limit(10),
    ]);

    const totalQuantityDelivered = await Delivery.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$quantityDelivered' } } }
    ]);

    res.json({
      period: type,
      totalSuppliers,
      totalShipments,
      totalDeliveries,
      totalQuantityDelivered: totalQuantityDelivered[0]?.total || 0,
      shipmentsByStatus,
      deliveriesByStatus,
      recentShipments,
      recentDeliveries,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET suppliers report
router.get('/suppliers', protect, async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    const { start, end } = getDateRange(type);
    const dateFilter = type !== 'all' ? { createdAt: { $gte: start, $lte: end } } : {};
    const suppliers = await Supplier.find(dateFilter).sort({ createdAt: -1 });
    res.json({ period: type, count: suppliers.length, data: suppliers });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET shipments report
router.get('/shipments', protect, async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    const { start, end } = getDateRange(type);
    const dateFilter = type !== 'all' ? { createdAt: { $gte: start, $lte: end } } : {};
    const shipments = await Shipment.find(dateFilter).populate('supplier', 'supplierName supplierCode').sort({ createdAt: -1 });
    res.json({ period: type, count: shipments.length, data: shipments });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET deliveries report
router.get('/deliveries', protect, async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    const { start, end } = getDateRange(type);
    const dateFilter = type !== 'all' ? { createdAt: { $gte: start, $lte: end } } : {};
    const deliveries = await Delivery.find(dateFilter)
      .populate({ path: 'shipment', populate: { path: 'supplier', select: 'supplierName supplierCode' } })
      .sort({ createdAt: -1 });
    const totalQty = deliveries.reduce((sum, d) => sum + d.quantityDelivered, 0);
    res.json({ period: type, count: deliveries.length, totalQuantity: totalQty, data: deliveries });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
