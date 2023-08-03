const express = require("express")
const router = express.Router();

const { 
    checkBalance,  
    } = require("../controllers/checkBalance")

const { 
    handleAuthentication,  
    } = require("../middleware/authenticate")

//request balance 
router.post("/check", handleAuthentication, checkBalance );

// //Verification
// router.post("/verify", handleVerification);

module.exports =  router;