const express = require("express")
const router = express.Router();

const card = require("./card")
const checkBalance = require("./checkBalance")
const withdrawal = require("./withdrawal")

router.use("/card",card)
router.use("/withdrawal", withdrawal)

router.use("/balance",checkBalance)




module.exports = router