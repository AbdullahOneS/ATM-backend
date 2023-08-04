const dotenv = require('dotenv').config()      
const cors = require('cors')
const express = require('express')
const routes = require('./routes/index') 
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Listening to port " + PORT)
})

//Restrict this later
app.use(cors({ origin: "*" }));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(bodyParser.json());

//for test
app.get('/',async (req, res) => {
    res.send("Hello")
})

app.use('/', routes)