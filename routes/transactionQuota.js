const express = require("express")
const router = express.Router();


const { 
    handleCheckTransactionQuota 
    } = require("../controllers/transactionQuota")

//Check Per day transaction quota of given user
router.post("/", handleCheckTransactionQuota );

module.exports =  router;