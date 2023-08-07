const express = require("express")
const router = express.Router();

const card = require("./card")
const checkBalance = require("./checkBalance")
const deposit = require("./deposit")
const blockCard = require("./blockCard")
const otp = require("./otp")
const transactionQuota = require("./transactionQuota")
const dotenv = require('dotenv');

const withdrawal = require("./withdrawal") 
const fundTransfer = require("./fundTransfer")

router.use("/card",card)
router.use("/withdrawal", withdrawal)
router.use("/fundTransfer", fundTransfer)
router.use("/balance",checkBalance)
router.use("/deposit",deposit)
router.use("/block",blockCard)
router.use("/otp",otp)
router.use("/transaction-quota", transactionQuota)


//Admin
const login = require("./admin/login")
const logout = require("./admin/logout")


router.use("/admin/login", login)
router.use("/admin/logout", logout)
module.exports = router