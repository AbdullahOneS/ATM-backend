const express = require("express")
const router = express.Router();
const { handleFundTransfer,getAccountName } = require("../controllers/fundTransfer");
const { handleAuthentication } = require("../middleware/authenticate");

//Fund Transfer
router.post("/", handleAuthentication, handleFundTransfer);

router.post("/acc_name", getAccountName);


module.exports =  router;