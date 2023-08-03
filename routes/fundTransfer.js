const express = require("express")
const router = express.Router();
const { handleFundTransfer } = require("../controllers/fundTransfer");
const { handleAuthentication } = require("../middleware/authenticate");

//Fund Transfer
router.post("/", handleAuthentication, handleFundTransfer);

module.exports =  router;