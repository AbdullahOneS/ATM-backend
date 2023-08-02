const express = require("express")
const router = express.Router();

const card = require("./card")
const checkBalance = require("./checkBalance")
// const withdraw = require("./withdraw")

router.use("/card",card)

router.use("/balance",checkBalance)




module.exports = router