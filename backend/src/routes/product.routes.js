const express = require('express');
const { getProducts, getProduct, createProduct } = require('../controllers/product.controller');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);

module.exports = router;
