const { pool } = require("../../config/db");

const getLogs = (req,res) =>{

    const sql = `select * from logs`;

    pool.query(sql, (err, result, fields) => {
        if (err) throw err;
        if (!result.length) {
          res.json({
            status: 401,
            message: "Logs not found",
          });
        }else{
            var temp_data = []
            result.forEach((val,index)=>{
                temp_data.push( {
                    key: index,
                    l_id: val.id+"",
                    c_no: val.card_no,
                    date_time: val.date_time,
                    action:val.action,
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
    getLogs,  
};