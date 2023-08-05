const express = require("express")
const router = express.Router();

const { 
    handleVerifyOtp, handleSendOTP  
    } = require("../controllers/blockCard")

//request balance 
router.post("/verify", handleVerifyOtp );
router.post("/send", handleSendOTP );


module.exports =  router;