const express = require('express');
const auth = require('../middleware/auth');
const { getCart, addToCart, removeFromCart } = require('../controllers/cart.controller');

const router = express.Router();

router.use(auth);
router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:productId', removeFromCart);

module.exports = router;
