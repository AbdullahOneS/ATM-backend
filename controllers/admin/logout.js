const { pool } = require("../../config/db");

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    //if cookies
    // const cookies = req.cookies;
    // if (!cookies?.jwt) return res.sendStatus(204); //No content
    // const webToken = cookies.jwt;
    const username = req.body.username
    console.log(username);
    if( username === undefined) {
      res.status(402).json({status: 402, message: "Please add username"})
    }

    // Is user in db?
    const sql = `Select * from web_token where username=?;`
    pool.query(sql, [username], async (err, result) => {
        if (err) throw err;

        if (result.length) {
            // Delete user in db
            const query = `DELETE from web_token WHERE username=?;`
          pool.query(query, [username], function (err, result) {
            if (err) throw err;

            if (!result.affectedRows) {
              console.log("web token not deleted from DB");
              res
                .status(203)
                .json({
                  status: 203,
                  message: `Sorry, Unable to delete ${result.affectedRows} web token`,
                })
            }
            //save token as cookie
            // res.cookie("jwt", webToken, {
            //   httpOnly: true,
            //   sameSite: "None",
            //   maxAge: 24 * 60 * 60 * 1000,
            // }); //add {secure: true, } for chrome
            res
              .status(200)
              .json({status: 200, message: "Logout successfull" });
          });

            // if cookie
            // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            // console.log("ti");
            // res.status(204).json({})

        } else {
            // if cookie
            // if (!foundUser) {
            //     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            //     return res.sendStatus(204);
            // }
            // else delete from client side too

            res.status(201).json({status:204, "message": "web token not in db but remove it from client side"})
        }
    })
}

module.exports = { handleLogout }