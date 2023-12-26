const { getAllUser, getAllFood, addFood, allOrders, getSpecificFood, orderCompleteOrNot, editFood, deleteFood, deleteUser } = require('../Controller/AdminControllers');

const express = require('express');
const router = express.Router();


router.get("/all/user", getAllUser);

router.get("/food/getFoods", getAllFood);

router.post("/food/addFood", addFood);

router.get('/get/food/:id', getSpecificFood);

router.get('/orders/get/all/orders', allOrders);

router.post('/order/delivery/:id', orderCompleteOrNot);

router.put("/edit/food", editFood);

router.delete("/delete/food/:id", deleteFood);

router.delete("/delete/user/:id", deleteUser);

module.exports = router;