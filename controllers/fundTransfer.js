const { pool } = require("../config/db");
const getBalanceByAccNo = require("../helper/getBalanceByAccNo");
const { addLog } = require("../helper/log");


async function handleFundTransfer(req, res) {
  const { receiver_acc_no, amount, card_no } = req.body;
  const sender_acc_no = req.account_no;

  try {
    const senderBalance = await getBalanceByAccNo(sender_acc_no);
    console.log(senderBalance);
    // 1000 is the minimum compulsory money to be kept in the account
    if (senderBalance < amount + 1000) {
      addLog(card_no, "Insufficient Balance");
      return res.json({
        status: 402,
        message: "Insufficient balance for fund transfer.",
      });
    }

    pool.getConnection((err, connection) => {
      if (err) {
        addLog(card_no, "Transfer Failed (Server Issue)");
        console.error("Error connecting to MySQL:", err);
        return res.json({
          status: 500,
          message: "Fund transfer failed. Please try again later.",
        });
      }
      
      connection.beginTransaction((err) => {
        if (err) {
          addLog(card_no, "Transfer Failed (Server Issue)");
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
        connection.query(
          updateSenderSql,
          [amount, sender_acc_no],
          (err, result) => {
            if (err) {
              addLog(card_no, "Transfer Failed While updating sender balance");
              
              connection.rollback(() => {
                connection.release();
                console.error("Error updating sender account balance:", err);
                return res.json({
                  status: 500,
                  message: "Fund transfer failed. Please try again later.",
                });
              });
            } else {
              // Update receiver's account balance
              console.log(sender_acc_no);
              const updateReceiverSql = `UPDATE account SET balance = balance + ? WHERE account_no = ?;`;
              connection.query(
                updateReceiverSql,
                [amount, receiver_acc_no],
                (err, result) => {
                  addLog(card_no, "Transfer Failed While updating balance");
                  if (err) {
                    connection.rollback(() => {
                      connection.release();
                      console.error(
                        "Error updating receiver account balance:",
                        err
                      );
                      return res.json({
                        status: 500,
                        message:
                        "Fund transfer failed. Please try again later.",
                      });
                    });
                  } else {
                    connection.commit((err) => {
                      if (err) {
                        addLog(card_no, "Transfer Failed (Server Issue)");
                        connection.rollback(() => {
                          connection.release();
                          console.error("Error committing transaction:", err);
                          return res.json({
                            status: 500,
                            message:
                              "Fund transfer failed. Please try again later.",
                            });
                          });
                        } else {
                        addLog(card_no, "Transfer Succcessful");
                        connection.release();
                        return res.json({
                          status: 200,
                          message: "Fund transfer successful.",
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
  } catch (err) {
    addLog(card_no, "Transfer Failed (Server Issue)");
    console.error("Error fetching balance:", err);
    return res.json({
      status: 500,
      message: "Fund transfer failed. Please try again later.",
    });
  }
}

// to fetch the account holder name
const getAccountName = async(req,res) =>{
    const {receiver_acc_no} = req.body
    if(!receiver_acc_no){
      return res.json({
        status: 500,
        message: "receiver_acc_no cannot be empty",
      });
    }else{
      const sql =`select c.name from account a left join customer c on  a.customer_id = c.customer_id where a.account_no = ?;`;

      pool.query(sql, [receiver_acc_no], (err, result) => {
        if (err) {
                console.error("Error updating sender account balance:", err);
                return res.json({
                    status: 500,
                    message: "Invalid Sender Account No",
                });
        }else{
          return res.json({
            status: 200,
            data: result[0]["name"],
        });
        }
      });




    }
}


module.exports = { handleFundTransfer,getAccountName };
