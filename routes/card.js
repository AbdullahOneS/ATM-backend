const express = require("express")
const router = express.Router();

const { 
    handleAuthentication, 
    handleVerification 
    
    } = require("../controllers/authenticate")

//Authenticate
router.post("/auth", handleAuthentication);

//Verification
router.post("/verify", handleVerification);

module.exports =  router;