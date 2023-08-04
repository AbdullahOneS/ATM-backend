const { pool } = require("../config/db");
const mailOTP = require("../helper/mailOTP.js");
const deleteOTP = require("../helper/deleteOTP.js");

const handleSendOtp = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("OTP Generated = ", otp);
  const email = req.body.email;
  console.log("Called");
  const sql = `Select * from operators where email="${email}";`;
  pool.query(sql, async function (err, result) {
    if (err) throw err;
    if (!result.length) {
      res.json({ status: 404, message: "Incorrect email" });
    } else {
      const result = await mailOTP(email, otp);
      if (result === "SUCCESS") {
        const sql = `Select * from otp where email="${email}";`;
        pool.query(sql, async (err, result) => {
          if (err) throw err;

          if (result.length) {
            await deleteOTP(email);
          }

          const query = `INSERT INTO otp VALUES ("${email}", "${otp}", current_timestamp())`;

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
  const email = req.body.email;
  const otp = req.body.otp;
  const sql = `Select * from otp where email="${email}";`;
  pool.query(sql, async function (err, result) {
    if (err) throw err;
    if (!result.length) {
      res.json({ status: 404, message: "Please first request for OTP" });
    } else {
      console.log(result);
      if (result[0]["time"].getTime() + 300000 >= new Date()) {
        //300000 = 5 minutes* 60 seconds * 1000 milisecond
        console.log("Not expired yet!");
        if (result[0]["otp"] == otp) {
          console.log("Correct otp");
          // await deleteOTP(email);
          res.json({ status: 200, message: "Correct OTP" });
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

const handleLogin = (req, res) => {
  console.log("hiii");
  const { username, password } = req.body;
  const sql = `Select * from operators where username="${username}";`;
  let email;
  // console.log(result[0]["password"]);
  pool.query(sql, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({
        status: 401,
        message: "Please try to login with correct credentials.",
      });
    } else if (match(password, result[0]["password"])) {
      email = result[0]["email"];
      const uid = result[0]["id"];
      const role = result[0]["role"];
      console.log("roke = ", role);
      //create JWTs
      const accessToken = jwt.sign(
        { uid, role },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "7d",
          // expiresIn: "300s",
        }
      );
      const refreshToken = jwt.sign(
        { uid, role },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "20d",
          // expiresIn: "7d",
        }
      );

      // console.log("ID = " + id.length);
      //Save refresh token in db
      //if token already present then update
      const sql = `SELECT * FROM refreshtoken WHERE uid="${uid}";`;
      pool.query(sql, async (err, result) => {
        if (err) throw err;
        // console.log("Here");
        //if already present in refreshtoken update refresh token else insert
        const query = result.length
          ? `UPDATE refreshtoken SET refreshToken='${refreshToken}' WHERE uid='${uid}';`
          : `insert into refreshtoken values ('${uid}', '${refreshToken}');`;
        pool.query(query, function (err, result) {
          if (err) throw err;

          if (!result.affectedRows) {
            console.log("Refresh token not update in DB");
            res.json({
              status: 403,
              message: `${result.affectedRows} Refresh token not update in DB`,
            });
          }
          // save token as cookie
          // res.cookie("jwt", refreshToken, {
          //   httpOnly: true,
          //   sameSite: "None",
          //   maxAge: 24 * 60 * 60 * 1000,
          // }); //add {secure: true, } for chrome
          res.json({
            status: 200,
            message: "Successfully Logged in",
            user: { uid, username, email, accessToken, refreshToken, role },
          });
        });
        // } else {
        //   //else insert new
        //   const query = `insert into refreshtoken values ('${uid}', '${refreshToken}');`;
        //   pool.query(query, function (err, result) {
        //     if (err) throw err;

        //     if (!result.affectedRows) {
        //       console.log("Refresh token not added to DB");
        //       res.status(403).json({
        //         message: `${result.affectedRows} Refresh token not added to DB`,
        //       });
        //     }
        //     //save token as cookie
        //     // res.cookie("jwt", refreshToken, {
        //     //   httpOnly: true,
        //     //   sameSite: "None",
        //     //   maxAge: 24 * 60 * 60 * 1000,
        //     // }); //add {secure: true, } for chrome
        //     res
        //       .status(200)
        //       .json({
        //         status: 200,
        //         message: "Successfully Logged in",
        //         user: {uid,
        //         username,
        //         email,
        //         accessToken,
        //         refreshToken,
        //         }
        //       });
        //   });
        // }
      });
    } else {
      res.json({
        status: 401,
        message: "Please try to login with correct credentials",
      });
    }
  });
};


//Change PAssword when the user knows the password
const changePassword = (req, res) => {
  const { email, password, newPassword } = req.body;
  const sql = `Select * from operators where email="${email}";`;
  // let email;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({
        status: 401,
        message: "Enter correct Email.",
      });
    } else if (match(password, result[0]["password"])) {
      const sql = `UPDATE operators SET password="${encrypt(newPassword)}" WHERE email="${email}";`;
      pool.query(sql, function (err, result) {
        if (err) throw err;
        if (!result.affectedRows) {
          console.log("Password not updated");
          res.json({
            status: 403,
            message: `${result.affectedRows} Password not updated`,
          });
        }
        res.json({
          status: 200,
          message: `${result.affectedRows} Password updated`,
        });
      });
    } else {
      res.json({
        status: 401,
        message: "You entered wrong password",
      });
    }
  });
};

//Change PAssword when the user forgets the password
const changePasswordWithOtp = (req, res) => {
  console.log("Called with " + JSON.stringify(req.body));
  const { otp, newPassword, email } = req.body;
  const sql1 = `Select * from otp where email="${email}";`;
  pool.query(sql1, async function (err, result) {
    if (err) throw err;
    if (!result.length) {
      res.json({ status: 404, message: "Please first request for OTP" });
    } else {
      console.log(result);
      console.log(result[0]["otp"]);

      if (result[0]["otp"] == otp) {
        console.log("Correct otp");
        await deleteOTP(email);
        // res.json({ status: 200, message: "Correct OTP" });
      } else {
        console.log("Incorrect otp");
        // await deleteOTP(email)
        res.json({ status: 404, message: "Incorrect OTP" });
      }
    }
  });
  const sql = `UPDATE operators SET password="${encrypt(newPassword)}" WHERE email="${email}";`;
  pool.query(sql, function (err, result) {
    if (err) throw err;
    if (!result.affectedRows) {
      console.log("Password not updated");
      res.json({
        status: 403,
        message: `${result.affectedRows} Password not updated`,
      });
    }
    res.json({
      status: 200,
      message: `${result.affectedRows} Password updated`,
    });
  });
}; 
module.exports = { handleLogin, handleSendOtp, handleVerifyOtp, changePassword, changePasswordWithOtp };