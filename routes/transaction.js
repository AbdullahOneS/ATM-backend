const express = require("express")
const router = express.Router();

const { 
    getTransaction 
    } = require("../controllers/transaction")

//get all transaction
router.get("/all", getTransaction );

module.exports =  router;