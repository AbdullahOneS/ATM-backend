const { pool } = require("../config/db");
const { match } = require("../helper/encrypt.js");

/*  
    Input: Card number
    function: Checks if card exists 
              Whether card is expired
              Status of the card
    Output: Appropriate status code and message
*/
const handleVerification = (req, res) => {
  console.log("hiii");
  const { cardNumber } = req.body;

  const sql = `Select status, exp_date from card where card_number=?;`;
  pool.query(sql, [cardNumber], (err, result, fields) => {
    if (err) throw err;
    if (!result.length) {
      res.json({
        status: 401,
        message: "Invalid Card Number",
      });
    } else if (result[0]["exp_date"] < DateTime.now()) {   //TODO: Rewrite this condition
        if (result[0]["status"] == "Active") {    // Card is active User can perform trnasactions
            res.json({
                status: 200,
                message: "Card is Active",       
            });
            
        } else if (result[0]["status"] == "Inactive"){   // Card is Inactive, Exceeded 3 attmepts
            res.json({
                status: 200,
                message: "You exceeded 3 PIN attempts, Please retry after 24 hours ", 
            });
        } else {        // Card(Status) is blocked i.e. Card is reported as stolen
            res.json({
                status: 200,
                message: "Your Card is blocked. Please contact bank", 
            });
        }
    } else {
        res.json({
            status: 200,
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
const handleAuthentication = (req, res) => {
  console.log("hiii");
  const { cardNumber, pin } = req.body;

  const sql = `Select pin from card where card_number=?;`;
  pool.query(sql, [cardNumber], (err, result, fields) => {
    if (err) throw err;
    if (!result.length) {
      res.json({
        status: 401,
        message: "Invalid Card Number",
      });
    } else if (match(pin, result[0]["pin"])) {
        res.json({
            status: 200,
            message: "Authentication Successful",
            
        }); 
    } else {
      res.json({
        status: 401,
        message: "Invalid PIN",
      });
    }
  });
};

module.exports = { handleAuthentication, handleVerification };