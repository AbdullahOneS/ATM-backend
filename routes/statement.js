const express = require("express")
const router = express.Router();

const { 
    printStatement,  
    } = require("../controllers/printStatement")

const { 
    handleAuthentication,  
    } = require("../middleware/authenticate")

//request balance 
router.post("/print",handleAuthentication ,printStatement);

// //Verification
// router.post("/verify", handleVerification);

module.exports =  router;