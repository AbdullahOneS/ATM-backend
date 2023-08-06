const { pool } = require("../config/db");
const getBalanceByAccNo = require("../helper/getBalanceByAccNo");
const { addLog } = require("../helper/log");

const addDeposit = (req, res, next) => {
  const { card_no, amount, atm_id } = req.body;
  const { n_100, n_200, n_500, n_2000 } = req.body.denomination;
  const account_no = req.account_no;

  // Perform deposit transaction
  pool.getConnection((err, connection) => {
    if (err) {
      addLog(card_no, "Deposit Failed (Server issue)");
      console.error("Error connecting to MySQL:", err);
      return res.json({
        status: 500,
        message: "Deposit failed. Please try again later.",
      });
    } else {
      connection.beginTransaction((err) => {
        if (err) {
          addLog(card_no, "Deposit Failed (Server issue");
          connection.release();
          console.error("Error starting transaction:", err);
          return res.json({
            status: 500,
            message: "Deposit failed. Please try again later.",
          });
        } else {
          // add balance in customer acount
          const addBalanceSql = `update account set balance = balance + ? where account_no=?;`;
          connection.query(
            addBalanceSql,
            [amount, account_no],
            (err, result) => {
              if (err) {
                addLog(card_no, "Deposit Failed While updating account");
                connection.rollback(() => {
                  connection.release();
                  console.error("Error updating card balance:", err);

                  return res.json({
                    status: 500,
                    message: "Deposit failed. Please try again later.",
                  });
                });
              } else {
                // update atm denomination
                const updateAtmSql = `update atm_machine 
        set n_100 = n_100 + ?,n_200 = n_200 + ?,n_500 = n_500 + ?,n_2000 = n_2000 + ?
        where atm_id = ?; `;
                connection.query(
                  updateAtmSql,
                  [n_100, n_200, n_500, n_2000, atm_id],
                  (err, result, fields) => {
                    if (err) {
                      addLog(card_no, "Deposit Failed While updating denominations");
                      connection.rollback(() => {
                        connection.release();
                        console.error("Error updating ATM denominations:", err);
                        return res.json({
                          status: 500,
                          message: "Deposit failed. Please try again later.",
                        });
                      });
                    } else {
                      connection.commit(async (err) => {
                        if (err) {
                          addLog(card_no, "Deposit Failed (Server issue)");
                          connection.rollback(() => {
                            connection.release();
                            console.error("Error committing transaction:", err);
                            return res.json({
                              status: 500,
                              message: "Deposit failed. Please try again later.",
                            });
                          });
                        } else {
                          req.balance = await getBalanceByAccNo(account_no)
                          connection.release();
                          addLog(
                            card_no,
                            `₹${amount} Deposited Successfully`
                          );
    
                          req.t_status = "success";
                          req.t_type = "deposit";
                          next();
                        }
                      });
                    
                    }  
                  }
                );
              }
            }
          );
        }
      });
    }
  });
};

module.exports = {
  addDeposit,
};
