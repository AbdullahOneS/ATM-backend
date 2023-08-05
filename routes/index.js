const express = require("express")
const router = express.Router();

const card = require("./card")
const checkBalance = require("./checkBalance")
const deposit = require("./deposit")
const blockCard = require("./blockCard")

const withdrawal = require("./withdrawal")
const fundTransfer = require("./fundTransfer")

router.use("/card",card)
router.use("/withdrawal", withdrawal)
router.use("/fundTransfer", fundTransfer)
router.use("/balance",checkBalance)
router.use("/deposit",deposit)
router.use("/block",blockCard)

module.exports = router