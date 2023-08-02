const dotenv = require('dotenv').config()      
const cors = require('cors')
const express = require('express')
const authenticate = require('./routes/authenticate') 
const bodyParser = require("body-parser")

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Listening to port " + PORT)
})

//Restrict this later
app.use(cors({ origin: "*" }));
app.use(bodyParser.json())
//for test
app.get('/',async (req, res) => {
    res.send("Hello")
})

app.use('/api/login', authenticate)
