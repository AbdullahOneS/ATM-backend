const express = require("express")
const router = express.Router();
const { verifyToken } = require('../../middleware/verifyToken')
const { 
    getTransaction 
    } = require("../../controllers/admin/transaction")

//get all transaction
router.get("/", verifyToken, getTransaction );

module.exports =  router;