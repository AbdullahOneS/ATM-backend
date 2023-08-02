const express = require("express")
const router = express.Router();

const { 
    checkBalance,  
    
    } = require("../controllers/checkBalance")

//request balance 
router.post("/check", checkBalance);

// //Verification
// router.post("/verify", handleVerification);

module.exports =  router;