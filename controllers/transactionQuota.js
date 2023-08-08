const { pool } = require("../config/db");

const handleCheckTransactionQuota = async (req, res) => {
    try {
      const { card_no, amount } = req.body;
    if (!card_no || !amount) {
        return res.json( { status: 402, message: "Please enter card_no and amount details"})
    }
      // Check the total transaction amount for withdrawals and transfers
      const sql = `SELECT SUM(amount) as total_amount
      FROM transaction
      WHERE card_no =? AND transaction_type = 'withdrawal' AND date(date_time) = current_date();`;
      const [result] = await pool.promise().query(sql, [card_no]);
  
      // Calculate the remaining combined quota for the day
      const currentQuota = result[0].total_amount || 0;
      const remainingQuota = 50000 - currentQuota;
  
      if (amount <= remainingQuota) {
        // User can perform the transaction since it does not exceed the daily quota
        return res.json({ status: 200, message: "Transaction allowed." });
      } else {
        // User has exceeded the daily quota and cannot perform the transaction
        return res.json({ status: 400, message: "Transaction not allowed. Daily quota exceeded." });
      }
    } catch (err) {
      console.error("Error checking transaction quota:", err);
      return res.json({ status: 500, message: "An error occurred. Please try again later." });
    }
  };

module.exports = { handleCheckTransactionQuota }