const express = require("express")
const router = express.Router();
const { handleWithdrawal, getDenomination } = require("../controllers/withdrawal");
const { handleAuthentication } = require("../middleware/authenticate");
const { addTransaction } = require("../controllers/transaction");

//Withdrawal
router.post("/", handleAuthentication, handleWithdrawal, addTransaction);

router.post("/denomination", getDenomination);


module.exports =  router ;