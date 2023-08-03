const { pool } = require("../config/db");
const { match } = require("../helper/encrypt.js");
const isNotExpired = require('../helper/expiry_utils');
const { addLog } = require("../helper/log");
/*  
    Input: Card number
    function: Checks if card exists 
              Whether card is expired
              Status of the card
    Output: Appropriate status code and message
*/
const handleVerification = (req, res) => {

  const { card_no } = req.body;


  const sql = `Select status, expiry_date from card where card_no=?;`;
  pool.query(sql, [card_no], (err, result, fields) => {
    if (err) throw err;
    if (!result.length) {
      res.json({
        status: 400,
        message: "Invalid Card Number",
      });
    } else if (isNotExpired(result[0]["expiry_date"]+"")) {   //Check if Card did not exceed the expiry date
        if (result[0]["status"] == "active") {    // Card is active User can perform trnasactions
          //to add the logs
          var now = new Date().toISOString();

          addLog(card_no,now.slice(0, 10),now.slice(11, 19),"Card Verified successfully");
          
          res.json({
                status: 200,
                message: "Card is Active",
            });
            
        } else if (result[0]["status"] == "inactive"){   // Card is Inactive, Exceeded 3 attmepts

            res.json({
                status: 401,
                message: "You exceeded 3 PIN attempts, Please retry after 24 hours ", 
            });
        } else {        // Card(Status) is blocked i.e. Card is reported as stolen
            res.json({
                status: 401,
                message: "Your Card is blocked. Please contact bank", 
            });
        }
    } else {
        res.json({
            status: 402,
            message: "Card has been expired",
           
        });
    }       
  });
};

/*
    Input: Card Number, Pin
    Function: Check whether Pin is correct or not
              by checking the hash value of pin.
              ( This would be always called after succesfull
                verification so no need to check status and all )
    Output: Appropriate message
*/
function handleAuthentication (req, res, next) {
  console.log("hiii");
  const { card_no, pin } = req.body;

  const sql = `Select pin from card where card_no=?;`;
  pool.query(sql, [card_no], (err, result, fields) => {
    // console.log(result[0]["pin"] + " =====> " + pin);

    if (err) throw err;
    if (!result.length) {
      return res.json({
        status: 401,
        message: "Invalid Card Number",
      });
      
    } else if (match(pin, result[0]["pin"])) {
        res.json({
            status: 200,
            message: "Authentication Successful",
        }); 
        next()
    } else {
      return res.json({
        status: 401,
        message: "Invalid PIN",
      });
    }
  });
};

module.exports = { 
  handleAuthentication, 
  handleVerification 
};