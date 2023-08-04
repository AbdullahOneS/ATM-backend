const { pool } = require("../config/db");

// Function to get balance from the account table using acc_no
function getBalanceByAccNo(acc_no) {
    const sql = `
      SELECT balance
      FROM account 
      WHERE account_no = ?;
    `;
  
    return new Promise((resolve, reject) => {
      pool.query(sql, [acc_no], (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length === 0) {
            resolve(null); // Account not found, return null
          } else {
            resolve(result[0].balance); // Return the balance from the first row
          }
        }
      });
    });
}

module.exports = getBalanceByAccNo