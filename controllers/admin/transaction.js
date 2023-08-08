const { pool } = require("../../config/db");
const { addLog } = require("../../helper/log");

const addTransaction = (req, res) => {

    const {card_no,r_account_no,amount,atm_id} = req.body;
    const t_status = req.t_status;
    const t_type = req.t_type;


    const sql = `insert into transaction(transaction_type,receiver_acc_no,amount,card_no,atm_id)
                values(?,?,?,?,?)`;

    pool.query(sql, [t_type,r_account_no,amount,card_no,atm_id], (err, result, fields) => {
        if (err) throw err;
        if (!result) {
            addLog(card_no,"Transaction Failed");
          res.json({
            status: 401,
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

const getTransaction = (req,res) =>{

    const sql = `select * from transaction`;

    pool.query(sql, (err, result, fields) => {
        if (err) throw err;
        if (!result.length) {
          res.json({
            status: 401,
            message: "Transaction not found",
          });
        }else{
            var temp_data = []
            result.forEach((val,index)=>{
                temp_data.push( {
                    key: index,
                    t_id: val.transaction_id+"",
                    date_time: val.date_time,
                    t_type: val.transaction_type,
                    r_acc_no: val.receiver_acc_no,
                    amt: val.amount,
                    c_no: val.card_no,
                    atm_id:val.atm_id,
                  });
            })
            
            res.json({
                status: 200,
                data:temp_data
            });
        } 
      });
}

module.exports = { 
    addTransaction,
    getTransaction,  
};