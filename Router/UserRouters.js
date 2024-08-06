const { userRegister, userLogin,filterProduct } = require('../Controller/UserControllers');
const express = require('express');
const router = express.Router();



router.post("/user/register", userRegister);
router.post("/user/login", userLogin);
router.get("/food/filter", filterProduct);

module.exports = router;