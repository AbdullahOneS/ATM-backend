const { pool } = require("../../config/db");
const { verifyToken } = require('../../middleware/verifyToken')

const getCardDetails = (req,res) =>{
    try {
        const query = `
        SELECT card.card_no , card.card_no , card.status , customer.name
        FROM card
        INNER JOIN account ON card.account_no = account.account_no
        INNER JOIN customer ON account.customer_id = customer.customer_id
        `;
    
        pool.query(query, (err, results) => {
        if (err) {
            console.error('Error executing the query:', err);
            return res.status(500).json({ error: 'Error retrieving card details' });
        } else {
            var temp_data = []
            results.forEach((val,index)=>{
                temp_data.push( {
                    key: index,
                    c_status: val.status,
                    c_no: val.card_no,
                    c_name: val.name
                  });
            })
            
            return res.json({
                status: 200,
                data:temp_data
            });
        }
    
        });
    } catch (err) {
        console.error('Error processing the request:', err);
        return res.json({ status: 200, error: 'An internal server error occurred' });
    }
    
}
const changeCardStatus = async (req,res) =>{
    try {
        const { card_no, status } = req.body
        if (!card_no || !status) {
            return res.json( { status:200, message: "Please enter card no and status to be changed."})
        }
    const updateSql = `UPDATE card SET status=? WHERE card_no=?`;
      const [updateResult] = await pool.promise().query(updateSql, [status, card_no]);

      if (updateResult.affectedRows === 0) {
        return res.json({ status: 404, message: "Card not found" });
      } else {

          return res.json({ status: 200, message: "Status of card changed to "+ status });
      }
        
    } catch (err) {
        console.error('Error processing the request:', err);
        return res.json({ status: 200, error: 'An internal server error occurred' });
    }
    
}



module.exports = { 
    getCardDetails, changeCardStatus
};