const express = require("express")
const router = express.Router();

const { 
    addDeposit,  
    } = require("../controllers/deposit")

const { 
    handleAuthentication,  
    } = require("../middleware/authenticate")

//request balance 
router.post("/add",handleAuthentication ,addDeposit);

// //Verification
// router.post("/verify", handleVerification);

module.exports =  router;