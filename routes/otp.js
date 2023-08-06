const express = require("express")
const router = express.Router();


const { 
    handleSendOTP, handleVerifyOtp  
    } = require("../controllers/otp")

//request balance 
router.post("/send", handleSendOTP );
router.post("/verify", handleVerifyOtp );

module.exports =  router;