const { pool } = require("../config/db");


const addLog =(card_no,action) => {
    const sql = `insert into logs(card_no,action) values(?,?);`;
    
    pool.query(sql, [card_no,action], (err, result, fields) => {
      if (err) throw err;
    });
}

module.exports = {
    addLog
}