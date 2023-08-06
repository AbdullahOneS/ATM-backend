const { pool } = require("../config/db");
const { match } = require("../helper/encrypt");
const { addLog } = require("../helper/log");
const { failedPinAttempts, deleteAttemptsByCardNo } = require("../helper/pinAttempts");


function handleAuthentication (req, res, next) {

    const { card_no, pin } = req.body;
    
    const sql = `select a.account_no, pin, c.name, c.email 
                from card ca
                left join account a on a.account_no = ca.account_no
                left join customer c on a.customer_id = c.customer_id where ca.card_no = ?; `;
    
    pool.query(sql, [card_no], (err, result, fields) => {
      if (err) throw err;
      if (!result.length) {
        addLog(card_no, "Invalid card number");
        return res.json({
          status: 403,
          message: "Invalid Card Number",
        });
      
      } else if (match(pin, result[0]["pin"])) {
        deleteAttemptsByCardNo(card_no)
        addLog(card_no, "Authenticated Successfully");
          req.account_no = result[0]["account_no"]
          req.body.email = result[0]["email"]
          req.account_name = result[0]["name"]
          next()
      } else {
        addLog(card_no, "Invalid PIN");
        failedPinAttempts(card_no);
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