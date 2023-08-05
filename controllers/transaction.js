const { pool } = require("../config/db");
const { addLog } = require("../helper/log");

const addTransaction = (req, res) => {

    const {card_no,r_account_no,amount,atm_id} = req.body;
    const t_status = req.t_status;
    const t_type = req.t_type;


    const sql = `insert into transaction(transaction_type,receiver_acc_no,transaction_status,amt,card_no,atm_id)
                values(?,?,?,?,?,?)`;

    pool.query(sql, [t_type,r_account_no,t_status,amount,card_no,atm_id], (err, result, fields) => {
        if (err) throw err;
        if (!result) {
            addLog(card_no,"Transaction Failed");
          res.json({
            status: 400,
            message: "Invalid Card Number",
          });
        }else{
            addLog(card_no,"Transaction Completed");
            res.json({
                status: 200,
                message: t_type+" Successful",
                data: {
                    transaction_id: result.insertId,
                    transaction_type: t_type,
                    receiver_acc_no: r_account_no,
                    transaction_status: t_status,
                    amount: amount,
                    card_no: card_no,
                    account_no: "XXXXXXXXX"+req.account_no.slice(10,14),
                    accout_name: req.account_name,
                    atm_id: atm_id,
                    balance: req.balance
                }
            });
        } 
      });
}

module.exports = { 
    addTransaction,  
};