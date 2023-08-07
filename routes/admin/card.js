const express = require("express");
const router = express.Router();
const { getCardDetails, changeCardStatus } = require('../../controllers/admin/card')
const { verifyToken } = require('../../middleware/verifyToken')

//Login
router.get("/", verifyToken, getCardDetails);
router.post("/change-status", verifyToken, changeCardStatus);

module.exports = router;