const express = require("express");
const router = express.Router();
const { getLogs } = require('../../controllers/admin/logs')

//Login
router.get("/all", getLogs);

module.exports = router;