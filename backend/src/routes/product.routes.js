const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { uploadImage } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", auth, admin, uploadImage, createProduct);
router.put("/:id", auth, admin, uploadImage, updateProduct);
router.delete("/:id", auth, admin, deleteProduct);

module.exports = router;