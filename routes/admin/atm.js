const express = require("express");
const router = express.Router();
const { getAtm } = require('../../controllers/admin/atm')
const { verifyToken } = require('../../middleware/verifyToken')


//get atm
router.get("/", verifyToken, getAtm);

module.exports = router;