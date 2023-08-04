const { pool } = require("../config/db");
const getBalanceByAccNo = require("../helper/getBalanceByAccNo");

/* input: withdrawal_amt, denominations ( eg. {n_2000: 5, n_500: 3, n_200: 4, n_100:4}), card_no
   functions: Check if account balance is sufficient
              Use transaction to update balance and atm_denominations and rollback if neccessary
   output: status of transaction
*/
function handleWithdrawal(req, res) {
  console.log(req.body);
  const { withdrawal_amt, denominations, card_no, atm_id } = req.body;

  getBalanceByAccNo(req.account_no)
    .then((balance) => {
      // 1000 is the minimum compulsory money to be kept in account
      if (balance < withdrawal_amt + 1000) {
        addLog(card_no, "Withdrawal Failed because of insufficient amount");
        
        return res.json({
          status: 200,
          message: "Insufficient balance for withdrawal.",
        });
      }
      
      // Perform withdrawal transaction
      pool.getConnection((err, connection) => {
        if (err) {
          addLog(card_no, "Withdrawal Failed (Server issue)");
          console.error("Error connecting to MySQL:", err);
          return res.json({
            status: 500,
            message: "Withdrawal failed. Please try again later.",
          });
        }
        
        connection.beginTransaction((err) => {
          if (err) {
            addLog(card_no, "Withdrawal Failed (Server issue)");
            connection.release();
            console.error("Error starting transaction:", err);
            return res.json({
              status: 500,
              message: "Withdrawal failed. Please try again later.",
            });
          }
          
          // Deduct the withdrawal amount from the card balance
          const newBalance = balance - withdrawal_amt;
          const updateCardSql = `UPDATE card AS c JOIN account AS a USING(account_no) SET a.balance =? WHERE c.card_no =?;`;
          connection.query(
            updateCardSql,
            [newBalance, card_no],
            (err, result) => {
              if (err) {
                addLog(card_no, "Withdrawal Failed while updating balance");
                connection.rollback(() => {
                  connection.release();
                  console.error("Error updating card balance:", err);
                  return res.json({
                    status: 500,
                    message: "Withdrawal failed. Please try again later.",
                  });
                });
              } else {
                // Update ATM denominations
                const { n_100, n_200, n_500, n_2000 } = denominations;
                const updateATMSql = `UPDATE atm_machine SET n_100=n_100-?, n_200=n_200-?, n_500=n_500-?, n_2000=n_2000-? WHERE atm_id=?;`;
                connection.query(
                  updateATMSql,
                  [n_100, n_200, n_500, n_2000, atm_id],
                  (err, result) => {
                    if (err) {
                    addLog(card_no, "Withdrawal Failed while updating ATM denominations");
                    console.log("Hereeeeeee");
                    connection.rollback(() => {
                      connection.release();
                      console.error("Error updating ATM denominations:", err);
                      return res.json({
                        status: 401,
                        message: "Withdrawal failed. Please try again later.",
                      });
                    });
                  } else {
                    connection.commit((err) => {
                      if (err) {
                      addLog(card_no, "Withdrawal Failed (Server Issue)");
                        connection.rollback(() => {
                          connection.release();
                          // console.error("Error committing transaction:", err);
                          return res.json({
                            status: 500,
                            message:
                              "Withdrawal failed. Please try again later.",
                          });
                        });
                      } else {
                        connection.release();
                        return res.json({
                          status: 200,
                          message: "Withdrawal successful.",
                        });
                      }
                    });
                  }
                }
              );
              }

              
            }
          );
        });
      });
    })
    .catch((err) => {
      addLog(card_no, "Transfer Failed (Server Issue)");
      console.error("Error fetching balance:", err);
      return res.json({
        status: 500,
        message: "Withdrawal failed. Please try again later.",
      });
    });
}

module.exports = { handleWithdrawal };
