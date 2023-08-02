const express = require("express")
const router = express.Router();
const { handleAuthentication } = require("../controllers/authenticate")

//Authenticate
router.post("/", handleAuthentication);

module.exports =  router ;