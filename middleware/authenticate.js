const { pool } = require("../config/db");
const { match } = require("../helper/encrypt");
const isNotExpired = require('../helper/expiry_utils');


function handleAuthentication (req, res, next) {

    const { cardNumber, pin } = req.body;
  
    const sql = `Select pin from card where card_no=?;`;
    pool.query(sql, [cardNumber], (err, result, fields) => {
      if (err) throw err;
      if (!result.length) {
        return res.json({
          status: 401,
          message: "Invalid Card Number",
        });
        
      } else if (match(pin, result[0]["pin"])) {
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
    handleAuthentication
}