const express = require("express")
const router = express.Router();
const { handleWithdrawal } = require("../controllers/withdrawal");
const { handleAuthentication } = require("../middleware/authenticate");

//Withdrawal
router.post("/", handleAuthentication, handleWithdrawal);

module.exports =  router ;