const { pool } = require("../config/db");


const addLog =(card_no,date,time,action) => {
    const sql = `insert into logs(card_no,date,time,action) values(?,?,?,?);`;
    
    pool.query(sql, [card_no,date,time,action], (err, result, fields) => {
      if (err) throw err;
    });
}

module.exports = {
    addLog
}