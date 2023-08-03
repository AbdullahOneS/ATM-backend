const { pool } = require("../config/db");
const { match } = require("../helper/encrypt");


function handleAuthentication (req, res, next) {

    const { card_no, pin } = req.body;
    console.log(req.body);
    const sql = `Select pin, account_no from card where card_no=?;`;
    pool.query(sql, [card_no], (err, result, fields) => {
      if (err) throw err;
      console.log("result = ", result);
      if (!result.length) {
        return res.json({
          status: 401,
          message: "Invalid Card Number",
        });
      
      } else if (match(pin, result[0]["pin"])) {
          req.account_no = result[0]["account_no"]
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