const { placementOrder, getAllOrdersByUser } = require('../Controller/OrderControllers');
const express = require('express');
const router = express.Router();


router.post("/orders/placeOrder", placementOrder);
router.post("/orders/getUserOrders", getAllOrdersByUser);

module.exports = router;