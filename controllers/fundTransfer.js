const { pool } = require("../config/db");
const getBalanceByAccNo = require("../helper/getBalanceByAccNo");

async function handleFundTransfer(req, res) {
  const { receiver_acc_no, amount } = req.body;
  const sender_acc_no = req.account_no
  console.log(receiver_acc_no, amount, sender_acc_no);
  try {
    const senderBalance = await getBalanceByAccNo(sender_acc_no);
    console.log(senderBalance);
    // 1000 is the minimum compulsory money to be kept in the account
    if (senderBalance < amount + 1000) {
      return res.json({
        status: 200,
        message: "Insufficient balance for fund transfer.",
      });
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        return res.json({
          status: 500,
          message: "Fund transfer failed. Please try again later.",
        });
      }

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          console.error("Error starting transaction:", err);
          return res.json({
            status: 500,
            message: "Fund transfer failed. Please try again later.",
          });
        }

        // Update sender's account balance
        console.log(sender_acc_no, senderBalance);
        
        const updateSenderSql = `UPDATE account SET balance = balance - ? WHERE account_no = ?;`;
        connection.query(updateSenderSql, [amount, sender_acc_no], (err, result) => {
            if (err) {
                connection.rollback(() => {
                    connection.release();
                    console.error("Error updating sender account balance:", err);
                    return res.json({
                        status: 500,
                        message: "Fund transfer failed. Please try again later.",
                    });
                });
            }
            
          // Update receiver's account balance
          console.log(sender_acc_no);
          const updateReceiverSql = `UPDATE account SET balance = balance + ? WHERE account_no = ?;`;
          connection.query(updateReceiverSql, [amount, receiver_acc_no], (err, result) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
                console.error("Error updating receiver account balance:", err);
                return res.json({
                  status: 500,
                  message: "Fund transfer failed. Please try again later.",
                });
              });
            }

            connection.commit((err) => {
              if (err) {
                connection.rollback(() => {
                  connection.release();
                  console.error("Error committing transaction:", err);
                  return res.json({
                    status: 500,
                    message: "Fund transfer failed. Please try again later.",
                  });
                });
              }

              connection.release();
              return res.json({
                status: 200,
                message: "Fund transfer successful.",
              });
            });
          });
        });
      });
    });
  } catch (err) {
    console.error("Error fetching balance:", err);
    return res.json({
      status: 500,
      message: "Fund transfer failed. Please try again later.",
    });
  }
}

module.exports = { handleFundTransfer };
