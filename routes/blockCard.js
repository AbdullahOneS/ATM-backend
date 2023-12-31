const express = require("express")
const router = express.Router();

const { 
    handleBlockCard  
    } = require("../controllers/blockCard")
const { 
    handleSendOTP, handleVerifyOtp  
    } = require("../controllers/otp")

//request balance 
router.post("/send", handleSendOTP );
router.post("/verify", handleBlockCard );


module.exports =  router;