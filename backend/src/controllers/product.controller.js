const mongoose = require("mongoose");
const Product = require("../models/Product");
const { imageUrlFor } = require("../middleware/upload.middleware");

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

const createProduct = async (req, res) => {
  const body = req.body || {};
  const image = req.file ? imageUrlFor(req.file.filename) : body.image;

  const missing = ["name", "description", "category", "price", "stock"].filter(
    (field) => !String(body[field] ?? "").trim()
  );
  if (missing.length || !image) {
    return res
      .status(400)
      .json({ message: "Name, description, price, stock, category and image are required" });
  }

  const product = await Product.create({
    name: body.name,
    description: body.description,
    price: Number(body.price),
    stock: Number(body.stock),
    category: body.category,
    image,
  });

  res.status(201).json({ product });
};

const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Product not found" });
  }

  const body = req.body || {};
  const updates = {};

  for (const field of ["name", "description", "category"]) {
    if (body[field] !== undefined) updates[field] = body[field];
  }
  if (body.price !== undefined) updates.price = Number(body.price);
  if (body.stock !== undefined) updates.stock = Number(body.stock);
  if (req.file) updates.image = imageUrlFor(req.file.filename);

  const product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
};

const deleteProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Product not found" });
  }

  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted" });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};