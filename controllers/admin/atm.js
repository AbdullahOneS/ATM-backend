const { pool } = require("../../config/db");

const getAtm = (req,res) =>{

    const sql = `select * from atm_machine where atm_id=1`;

    pool.query(sql, (err, result, fields) => {
        if (err) throw err;
        if (!result.length) {
          res.json({
            status: 401,
            message: "Atm not found",
          });
        }else{
            
            res.json({
                status: 200,
                data:result
            });
        } 
      });
}

module.exports = { 
    getAtm,  
};