const { userRegister, userLogin } = require('../Controller/UserControllers');
const express = require('express');
const router = express.Router();



router.post("/user/register", userRegister);
router.post("/user/login", userLogin);

module.exports = router;