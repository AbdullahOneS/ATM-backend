const { pool } = require("../../config/db");
const { verifyToken } = require('../../middleware/verifyToken')

const getCardDetails = (req,res) =>{
    try {
        const query = `
        SELECT card.card_no as key, card.card_no as c_no, card.status as c_status, customer.name as c_name
        FROM card
        INNER JOIN account ON card.account_no = account.account_no
        INNER JOIN customer ON account.customer_id = customer.customer_id
        `;
    
        pool.query(query, (err, results) => {
        if (err) {
            console.error('Error executing the query:', err);
            return res.status(500).json({ error: 'Error retrieving card details' });
        } else {
            return res.json( {status: 200, data: results });
        }
    
        });
    } catch (err) {
        console.error('Error processing the request:', err);
        return res.json({ status: 200, error: 'An internal server error occurred' });
    }
    
}



module.exports = { 
    getCardDetails
};