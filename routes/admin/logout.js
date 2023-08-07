const express = require("express");
const router = express.Router();
const { handleLogout } = require('../../controllers/admin/logout')

//Logout
router.post("/", handleLogout);

module.exports = router;