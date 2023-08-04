const { pool } = require("../config/db");

function tryActivation(card_no, res) {
  console.log(card_no);
  const selectSql = `SELECT *
    FROM inactive_card 
    WHERE card_no='1234567812345678' AND date_time < DATE_SUB(NOW(), INTERVAL 24 HOUR);`;
  pool.query(selectSql, [card_no], (err, result) => {
    console.log("Select reuslt", result);
    if (err) {
      console.error("Error checking pin attempts:", err);
      res.json({
        status: 401,
        message:
          "Your card is currently inactive, Please retry after 24 hours ",
      });
      return false;
    } else if (result.length) {
      const deleteSql = `DELETE FROM inactive_card WHERE card_no=?;`;
      pool.query(deleteSql, [card_no], (err, result) => {
        console.log("delete reuslt", result);
        console.log("deltelte");
        if (err) {
          console.error("Error deleting pin attempt:", err);
          res.json({
            status: 401,
            message:
              "Your card is currently inactive, Please retry after 24 hours ",
          });
          return false;
        } else {
          const updateCardSql = `UPDATE card SET status='active' WHERE card_no=?;`;
          console.log("updated");
          pool.query(updateCardSql, [card_no], (err, result) => {
            console.log("Update reuslt", result);
            if (err) {
              console.error("Error updating card status:", err);
              res.json({
                status: 401,
                message:
                  "Your card is currently inactive, Please retry after 24 hours ",
              });
              return false;
            } else {
              res.json({
                status: 200,
                message:
                  "Your card is Active ",
              });
              console.log("True");
              return true;
            }
          });
        }
      });
    } else {
      res.json({
        status: 401,
        message:
          "Your card is currently inactive, Please retry after 24 hours ",
      });
      return false;
    }
  });
}


module.exports = { tryActivation };
