const { pool } = require("../config/db");
const { match } = require("../helper/encrypt");


function handleAuthentication (req, res, next) {

    const { card_no, pin } = req.body;
    
    const sql = `select a.account_no,pin,c.name
                from card ca
                left join account a on a.account_no = ca.account_no
                left join customer c on a.customer_id = c.customer_id where ca.card_no = ?; `;
    
    pool.query(sql, [card_no], (err, result, fields) => {
      if (err) throw err;
      if (!result.length) {
        return res.json({
          status: 401,
          message: "Invalid Card Number",
        });
      
      } else if (match(pin, result[0]["pin"])) {
          req.account_no = result[0]["account_no"]
          req.account_name = result[0]["name"]
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