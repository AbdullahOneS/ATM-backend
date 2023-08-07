const express = require("express")
const router = express.Router();

const { 
    addDeposit,  
    } = require("../controllers/deposit")

const { handleAuthentication } = require("../middleware/authenticate");

const { addTransaction } = require("../controllers/admin/transaction");

//request balance 
router.post("/add",handleAuthentication ,addDeposit,addTransaction);

// //Verification
// router.post("/verify", handleVerification);

module.exports =  router;