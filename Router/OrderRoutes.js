const { placementOrder, getAllOrdersByUser,getMostOrderedFoods } = require('../Controller/OrderControllers');
const express = require('express');
const router = express.Router();


router.post("/orders/placeOrder", placementOrder);
router.post("/orders/getUserOrders", getAllOrdersByUser);
router.get("/orders/most", getMostOrderedFoods);

module.exports = router;