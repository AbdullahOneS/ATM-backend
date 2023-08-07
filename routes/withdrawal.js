const express = require("express")
const router = express.Router();
const { handleWithdrawal, getDenomination } = require("../controllers/withdrawal");
const { handleAuthentication } = require("../middleware/authenticate");
const { addTransaction } = require("../controllers/transaction");
const verifyJWT = require('../middleware/verifyToken')
//Withdrawal
// router.post("/", verifyJWT, handleAuthentication, handleWithdrawal, addTransaction);
router.post("/", handleAuthentication, handleWithdrawal, addTransaction);

router.post("/denomination", getDenomination);


module.exports =  router ;