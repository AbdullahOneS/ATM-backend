const express = require("express")
const router = express.Router();
const { handleFundTransfer,getAccountName } = require("../controllers/fundTransfer");
const { addTransaction } = require("../controllers/admin/transaction");
const { handleAuthentication } = require("../middleware/authenticate");

//Fund Transfer
router.post("/", handleAuthentication, handleFundTransfer, addTransaction);

router.post("/acc_name", getAccountName);


module.exports =  router;