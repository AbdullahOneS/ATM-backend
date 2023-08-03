const { pool } = require("../config/db");

// Function to get balance from the account table using card_no
function getBalanceByCardNo(card_no) {
    const sql = `
      SELECT a.balance
      FROM account AS a
      JOIN card AS c ON a.account_no = c.account_no
      WHERE c.card_no = ?;
    `;
  
    return new Promise((resolve, reject) => {
      pool.query(sql, [card_no], (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length === 0) {
            resolve(null); // Card not found, return null
          } else {
            resolve(result[0].balance); // Return the balance from the first row
          }
        }
      });
    });
}

module.exports = getBalanceByCardNo