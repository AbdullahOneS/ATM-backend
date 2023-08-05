const { pool } = require("../config/db");
const { addLog } = require("../helper/log");
const mailOTP = require("../helper/mailOTP");
const deleteOTP = require("../helper/deleteOTP");

const handleSendOTP = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("OTP Generated = ", otp);
  const account_no = req.body.account_no;
  console.log("Called");
  const sql = `select c.email
  from account a 
  left join customer c on a.customer_id = c.customer_id where a.account_no = ?;`;
  pool.query(sql, [account_no], async function (err, results) {
    console.log(results);
    if (err) throw err;
    if (!results.length) {
      results.json({ status: 404, message: "Incorrect email" });
    } else {
      const email = results[0]["email"];
      const result = await mailOTP(email, otp);
      if (result === "SUCCESS") {
        const sql = `Select * from otp where email="${email}";`;
        pool.query(sql, async (err, result) => {
          if (err) throw err;

          if (result.length) {
            await deleteOTP(email);
            console.log("Deleting");
          }

          const query = `INSERT INTO otp(email, otp) VALUES ("${email}", "${otp}")`;

          pool.query(query, function (err, result) {
            if (err) throw err;

            if (!result.affectedRows) {
              console.log("OTP not added to db");
              res.json({
                status: 300,
                message: `${result.affectedRows} otp not addded but sent succesfully`,
              });
            }
            res.json({
              status: 200,
              message: `${result.affectedRows} otp addded and sent succesfully`,
                email
            });
          });
        });
      } else {
        res.json({ status: 500, message: result });
      }
    }
  });
};

const handleVerifyOtp = (req, res) => {
  console.log("Called with body = ", req.body);
  const { account_no, email, otp } = req.body;
  console.log(email);
  const sql = `Select * from otp where email=?;`;
  pool.query(sql, [email], async function (err, result) {
    if (err) throw err;
    if (!result.length) {
      res.json({ status: 404, message: "Please first request for OTP" });
    } else {
      console.log(result);
      if (1 ||result[0]["time"].getTime() + 300000 >= new Date()) {
        //300000 = 5 minutes* 60 seconds * 1000 milisecond
        console.log("Not expired yet!");
        if (result[0]["otp"] == otp) {
          console.log("Correct otp");
          await deleteOTP(email);
          const sql = `Update card set status="blocked" where account_no=?`;
          pool.query(sql, [account_no], async function (err, result, fields) {
            if (err) throw err;
              const sql = `Select card_no from card where account_no=?`;
              pool.query(sql, [account_no], async function (err, result) {
                addLog(result[0]['card_no'], "Card has been blocked");
                res.json({ status: 200, message: "Card has been blocked" });
              });
            
          });
          //300000 = 5 minutes* 60 seconds * 1000 milisecond
        } else {
          console.log("Incorrect otp");
          // await deleteOTP(email)
          res.json({ status: 404, message: "Incorrect OTP" });
        }
      } else {
        console.log("Expired");
        res.json({ status: 404, message: "Expired" });
      }
    }
  });
};

const handleBlockCard = (req, res) => {};

module.exports = {  handleVerifyOtp, handleSendOTP };
