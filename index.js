require('dotenv').config()      
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import login from './routes/login'
import logout from './routes/logout'


const app = express();
app.use(json());
app.use(urlencoded({extended: true}))
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Listening to port " + PORT)
})

//Restrict this later
app.use(cors({ origin: "*" }));

//for test
app.get('/',async (req, res) => {
    res.send("Hello")
})

app.use('/api/login', login)
app.use('/api/logout', logout)
