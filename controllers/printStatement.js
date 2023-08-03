const { pool } = require("../config/db");
const { addLog } = require("../helper/log");



const printStatement = (req, res) => {

    const { card_no} = req.body;
    
    // query to be modified
    const sql = `select balance,card_no,account.account_no,customer.name
    from card 
    left join account on card.account_no = account.account_no
    left join customer on account.customer_id = customer.customer_id
    where card_no = ?;`;

    pool.query(sql, [card_no], (err, result, fields) => {
        if (err) throw err;
        if (!result.length) {
          res.json({
            status: 400,
            message: "Invalid Card Number",
          });
        }else{
            var now = new Date().toISOString();
            addLog(card_no,now.slice(0, 10),now.slice(11, 19),"Printed Statement Sucessfully");
            res.json({
                status: 200,
                data: {
                    name: result[0]["name"],
                    account_no: result[0]["account_no"],
                    card_no: result[0]["card_no"],
                    balance: result[0]["balance"]
                },
            });
        } 
      });
}

module.exports = { 
    printStatement,  
};