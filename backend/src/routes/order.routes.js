const express = require('express');
const auth = require('../middleware/auth');
const { createOrder, getOrders, getOrder } = require('../controllers/order.controller');

const router = express.Router();

router.use(auth);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

module.exports = router;
