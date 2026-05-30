const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const { protect } = require('../middleware/auth');

// GET all suppliers
router.get('/', protect, async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single supplier
router.get('/:id', protect, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create supplier
router.post('/', protect, async (req, res) => {
  try {
    const { supplierCode, supplierName, telephone, address, email } = req.body;
    if (!supplierCode || !supplierName || !telephone || !address || !email)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await Supplier.findOne({ $or: [{ supplierCode }, { email }] });
    if (exists) return res.status(400).json({ message: 'Supplier code or email already exists' });

    const supplier = await Supplier.create({ supplierCode, supplierName, telephone, address, email });
    res.status(201).json(supplier);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update supplier
router.put('/:id', protect, async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE supplier
router.delete('/:id', protect, async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
