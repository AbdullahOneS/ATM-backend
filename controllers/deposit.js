const { pool } = require("../config/db");
const { addLog } = require("../helper/log");

const addDeposit = (req,res)=>{

    const {card_no,amount,atm_id,transaction_type} = req.body;
    const {n_100,n_200,n_500,n_2000} = req.body.denomination;
    const account_no = req.account_no; 

    // adding balance in customer acount
    const addBalanceSql = `update account set balance = balance + ? where account_no=?;`;
    pool.query(addBalanceSql, [amount,account_no], (err, result, fields) => {
        if (err) throw err;
        if (result) {
          return res.json({
            status: 200,
            message: result,
          });
          
        }
      });

    
    // updating atm denomination
    const updateAtmSql = `update atm_machine 
                            set n_100 = n_100 + ?,n_200 = n_200 + ?,n_500 = n_500 + ?,n_2000 = n_2000 + ?
                            where atm_id = ?; `;
    pool.query(updateAtmSql, [n_100,n_200,n_500,n_2000,atm_id], (err, result, fields) => {
        if (err) throw err;
        if (result) {
          return res.json({
            status: 200,
            message: result,
          });
          
        }
      });

}

module.exports = {
    addDeposit,
}