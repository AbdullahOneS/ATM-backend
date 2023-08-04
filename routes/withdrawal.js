const express = require("express")
const router = express.Router();
const { handleWithdrawal, getDenomination } = require("../controllers/withdrawal");
const { handleAuthentication } = require("../middleware/authenticate");

//Withdrawal
router.post("/", handleAuthentication, handleWithdrawal);

router.post("/denomination", getDenomination);


module.exports =  router ;