const { pool } = require("../config/db");
const { addLog } = require("../helper/log");

const addDeposit = (req,res,next)=>{
    const {card_no,amount,atm_id } = req.body;
    const {n_100,n_200,n_500,n_2000} = req.body.denomination;
    const account_no = req.account_no; 

    // Perform deposit transaction
    pool.getConnection((err, connection) => {
      if (err) {
        addLog(card_no,"Deposit Failed");
        console.error("Error connecting to MySQL:", err);
        return res.json({
          status: 500,
          message: "Deposit failed. Please try again later.",
        });
      }

      connection.beginTransaction((err) => {
        if (err) {
            addLog(card_no,"Deposit Failed");
          connection.release();
          console.error("Error starting transaction:", err);
          return res.json({
            status: 500,
            message: "Deposit failed. Please try again later.",
          });
        }

      // add balance in customer acount
      const addBalanceSql = `update account set balance = balance + ? where account_no=?;`;
      connection.query(addBalanceSql, [amount,account_no], (err, result) => {
        if (err) {
            addLog(card_no,"Deposit Failed");
          connection.rollback(() => {
            connection.release();
            console.error("Error updating card balance:", err);

            return res.json({
              status: 500,
              message: "Deposit failed. Please try again later.",
            });

          });
        }

      
      // update atm denomination
      const updateAtmSql = `update atm_machine 
                              set n_100 = n_100 + ?,n_200 = n_200 + ?,n_500 = n_500 + ?,n_2000 = n_2000 + ?
                              where atm_id = ?; `;
      connection.query(updateAtmSql, [n_100,n_200,n_500,n_2000,atm_id], (err, result, fields) => {
        if (err) {
            addLog(card_no,"Deposit Failed");
          connection.rollback(() => {
            connection.release();
            console.error("Error updating ATM denominations:", err);
            return res.json({
              status: 500,
              message: "Deposit failed. Please try again later.",
            });
          });
        }

        connection.commit((err) => {
        
          if (err) {
            addLog(card_no,"Deposit Failed");
            connection.rollback(() => {
              connection.release();
              console.error("Error committing transaction:", err);
              return res.json({
                status: 500,
                message: "Deposit failed. Please try again later.",
              });
            });
          }

          connection.release();
          addLog(card_no,`${amount} Amount Deposited Successfully`);

          req.t_status = 'success';
          req.t_type = 'deposit';
          next();
        });
      });
    });
  });
});
}

module.exports = {
    addDeposit,
}