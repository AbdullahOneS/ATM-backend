const { pool } = require("../config/db");

// Function to get balance from the account table using acc_no
// async function getAccountNoByCardNo(res, card_no) {
//     console.log(card_no);
//     try {
//         if (card_no === undefined) {
//             console.log("Account/Card number not found");
//             return res.json( {
//                 status: 402, message: "Please insert valid Account/Card number."
//             })
//         } else {
//             console.log("Here");
//             const sql = `select account_no from card where card_no = ?;`;
                        
//             pool.query(sql, [ card_no ], async function (err, results) {
//           // console.log(results);
//           console.log(results);
//             if (!results.length) {
//                 return res.json({ status: 401, message: "Account number does not exist" });
//             } else {
//                 console.log("here2");
//                 console.log(results[0]["account_no"]);
//                 return results[0]["account_no"];
//             }
//         });
//         }
//     } catch {
//         console.error("Error fetching account number:", err);
//     return null;
//     }
// }

async function getAccountNoByCardNo(card_no) {
    console.log(card_no);
    try {
      if (card_no === undefined) {
        console.log("Account/Card number not found");
        throw new Error("Please insert a valid Account/Card number.");
      } else {
        console.log("Here");
        const sql = `SELECT account_no FROM card WHERE card_no = ?;`;
        const [results] = await pool.promise().query(sql, [card_no]);
        console.log(results);
        if (!results.length) {
          throw new Error("Account number does not exist");
        } else {
          console.log("here2");
          console.log(results[0]["account_no"]);
          return results[0]["account_no"];
        }
      }
    } catch (err) {
      console.error("Error fetching account number:", err);
      throw err; // Rethrow the error so the calling function can catch it.
    }
  }
  

module.exports = { getAccountNoByCardNo }