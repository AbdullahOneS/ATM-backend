const { pool } = require("../config/db");
const { addLog } = require("../helper/log");
const mailOTP = require("../helper/mailOTP");
const { handleVerifyOtp } = require("./otp")
const deleteOTP = require("../helper/deleteOTP");

const handleBlockCard = async (req, res) => {
  const { account_no } = req.body;

  try {
    // Call handleVerifyOtp with a function as the callback
    handleVerifyOtp(req, res, async () => {
      const blockSql = `UPDATE card SET status="blocked" WHERE account_no=?`;
      const [blockResult] = await pool.promise().query(blockSql, [account_no]);

      if (blockResult.affectedRows === 0) {
        return res.json({ status: 404, message: "Account not found" });
      }

      const cardSql = `SELECT card_no FROM card WHERE account_no=?`;
      const [cardResult] = await pool.promise().query(cardSql, [account_no]);

      if (cardResult.length !== 0) {
        const card_no = cardResult[0]["card_no"];
        addLog(card_no, "Card has been blocked");
      } else {
        console.log( "Card not found" );
      }
      return res.json({ status: 200, message: "Card has been blocked" });
    });
  } catch (err) {
    console.error("Error handling card blocking:", err);
    return res.json({ status: 500, message: "An error occurred. Please try again later." });
  }
};


module.exports = { handleBlockCard };
