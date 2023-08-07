const { pool } = require("../config/db");
const { addLog } = require("../helper/log");
const mailOTP = require("../helper/mailOTP");
const deleteOTP = require("../helper/deleteOTP");
const { getAccountNoByCardNo } = require("../helper/getAccountNoByCardNo");

// const handleSendOTP = async (req, res) => {
//     // get this from authentication middleware (withdrawal + fund transfer)
//     // else from body (Block card)
//     let account_no = req.body.account_no;
//     if (account_no === undefined) {
//         account_no = await getAccountNoByCardNo(req.body.card_no)
//         console.log("Account number = ", account_no);
//     }
//     console.log("Account number = ", account_no);
//     const sql = `select c.email
//                     from account a 
//                     left join customer c on a.customer_id = c.customer_id where a.account_no = ?;`;
                    
//     pool.query(sql, [ account_no ], async function (err, results) {
//       // console.log(results);
//       if (err) throw err;
//       if (!results.length) {
//         return res.json({ status: 401, message: "Account number does not exist" });
//       } else {
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         console.log(otp);
//         const email = results[0]["email"];
//         const result = await mailOTP(email, otp);
//         if (result === "SUCCESS") {
//           const sql = `Select * from otp where email=?;`;
//           pool.query(sql, [email], async (err, result) => {
//             if (err) throw err;
  
//             if (result.length) {
//               await deleteOTP(email);
//               // console.log("Deleting");
//             }
  
//             const query = `INSERT INTO otp(email, otp) VALUES (?, ?)`;
  
//             pool.query(query, [email, otp], function (err, result) {
//               if (err) throw err;
  
//               if (!result.affectedRows) {
//                 console.log("OTP not added to db");
//                 res.json({
//                   status: 500,
//                   message: `${result.affectedRows} otp not addded but sent succesfully`,
//                 });
//               }
//               res.json({
//                 status: 200,
//                 message: `${result.affectedRows} otp addded and sent succesfully`,
//                 email,
//               });
//             });
//           });
//         } else {
//           res.json({ status: 500, message: result });
//         }
//       }
//     });
// };

const handleSendOTP = async (req, res) => {
  // get this from authentication middleware (withdrawal + fund transfer)
  // else from body (Block card)
  let account_no = req.body.account_no;
  if (account_no === undefined) {
     account_no = await getAccountNoByCardNo(req.body.card_no);

    if (account_no === null) {
      return res.json({ status: 500, message: "An error occurred. Please try again later." });
    } else {
      console.log("account no = ", account_no);
    }
      
      
  }
  console.log("Account number = ", account_no);
  const sql = `select c.email
                  from account a 
                  left join customer c on a.customer_id = c.customer_id where a.account_no = ?;`;
                  
  pool.query(sql, [ account_no ], async function (err, results) {
    // console.log(results);
    if (err) throw err;
    if (!results.length) {
      return res.json({ status: 401, message: "Account number does not exist" });
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000);
      console.log(otp);
      const email = results[0]["email"];
      const result = await mailOTP(email, otp);
      if (result === "SUCCESS") {
        const sql = `Select * from otp where email=?;`;
        pool.query(sql, [email], async (err, result) => {
          if (err) throw err;

          if (result.length) {
            await deleteOTP(email);
            // console.log("Deleting");
          }

          const query = `INSERT INTO otp(email, otp) VALUES (?, ?)`;

          pool.query(query, [email, otp], function (err, result) {
            if (err) throw err;

            if (!result.affectedRows) {
              console.log("OTP not added to db");
              res.json({
                status: 500,
                message: `${result.affectedRows} otp not addded but sent succesfully`,
              });
            }
            res.json({
              status: 200,
              message: `${result.affectedRows} otp addded and sent succesfully`,
              email,
            });
          });
        });
      } else {
        res.json({ status: 500, message: result });
      }
    }
  });
};

const handleVerifyOtp = (req, res, callback ) => {
    console.log("Called with body = ", req.body);
    const {  email, otp } = req.body;
    if (!email || !otp) {
      return res.json( {
        status: 402,
        message: "Please add Email and OTP"
      })
    }
    console.log(email);
  
    // Instead of querying the email, we can directly use the received email for OTP verification
    const sql = `Select * from otp where email=?;`;
    pool.query(sql, [email], async function (err, result) {
      if (err) throw err;
      if (!result.length) {
        return res.json({ status: 402, message: "Please first request for OTP" });
      } else {
        // 300000 = 5 minutes * 60 seconds * 1000 milliseconds
        if (result[0]["date_time"].getTime() + 300000 >= new Date()) {
          if (result[0]["otp"] == otp) {
            console.log("Correct otp");
             deleteOTP(email);
            console.log( callback.constructor.name === 'AsyncFunction');
            (callback.constructor.name === 'AsyncFunction')
                ? callback() // Call the callback function when OTP is correct
                : (() => {
                  console.log("Not blocking card");
                    return res.json({
                        status:200, 
                        message: "OTP verified succesfully"
                    })
                })()
                
          } else {
            console.log("Incorrect otp");
            return res.json({ status: 403, message: "Incorrect OTP" });
          }
        } else {
          console.log("Expired");
          return res.json({ status: 401, message: "Expired" });
        }
      }
    });
};

module.exports = { handleVerifyOtp, handleSendOTP };