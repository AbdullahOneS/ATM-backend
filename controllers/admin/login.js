const { pool } = require("../../config/db");
const jwt = require("jsonwebtoken");
const { match, encrypt } = require("../../helper/encrypt.js");

const handleLogin = (req, res) => {
  console.log("hiii");
  const { username, password } = req.body;
  const sql = `Select * from admin where username=?;`;
  // console.log(result[0]["password"]);
  pool.query(sql, [username], (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({
        status: 401,
        message: "Please try to login with correct credentials.",
      });
    } else if (match(password, result[0]["password"])) {
      // Create JWTs
      const webToken = jwt.sign({ username }, process.env.WEB_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      //Save web token in db
      //if token already present then update
      const sql = `SELECT * FROM web_token WHERE username=?;`;
      pool.query(sql, [username], async (err, result) => {
        if (err) throw err;
        console.log("Here");

        //if already present in webToken update refresh token else insert
        const query = result.length
          ? `UPDATE web_token SET webToken=? WHERE uid=?;`
          : `insert into web_token values (?, ?);`;
        pool.query(
          query,
          result.length ? [webToken, username] : [username, webToken],
          function (err, result) {
            if (err) throw err;

            if (!result.affectedRows) {
              console.log("Refresh token not update in DB");
              res.json({
                status: 403,
                message: `${result.affectedRows} Refresh token not update in DB`,
              });
            }
            // save token as cookie
            // res.cookie("jwt", webToken, {
            //   httpOnly: true,
            //   sameSite: "None",
            //   maxAge: 24 * 60 * 60 * 1000,
            // }); //add {secure: true, } for chrome
            res.json({
              status: 200,
              message: "Successfully Logged in",
              user: { username, webToken },
            });
          }
        );
        // } else {
        //   //else insert new
        //   const query = `insert into webToken values ('${uid}', '${webToken}');`;
        //   pool.query(query, function (err, result) {
        //     if (err) throw err;

        //     if (!result.affectedRows) {
        //       console.log("Refresh token not added to DB");
        //       res.status(403).json({
        //         message: `${result.affectedRows} Refresh token not added to DB`,
        //       });
        //     }
        //     //save token as cookie
        //     // res.cookie("jwt", webToken, {
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
        //         webToken,
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

module.exports = { handleLogin };
