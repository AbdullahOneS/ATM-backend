const express = require("express");
const router = express.Router();
const { handleLogin } = require('../../controllers/admin/login')

//Login
router.post("/", handleLogin);

module.exports = router;