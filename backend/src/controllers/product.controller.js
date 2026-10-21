const mongoose = require("mongoose");
const Product = require("../models/Product");

const getProducts = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 8, 1), 50);

  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  });
};

const getProductById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Product not found" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
};

module.exports = { getProducts, getProductById };