const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const verifyToken = (req, res) => {
  console.log("refresh called");
  const token_header =
    req.header("Authorization") || req.header("authorization");
  console.log(token_header);
  if (!token_header) {
    res.json({ status: 401, message: "Please add access token" });
  }
  try {
    const token = token_header.split(" ")[1];
    console.log("TOken: ", token);
    const data = jwt.verify(token, process.env.WEB_TOKEN_SECRET);
    //if cookies
    //   const cookies = req.cookies;
    //   if (!cookies?.jwt)
    //     return res
    //       .status(401)
    //       .json({ message: "please login to set refresh token as cookie" });
    //   const refreshToken = cookies.jwt;
    //   const refreshToken = req.body.refreshToken;
    // console.log(refreshToken);
    //check if refresh token is valid(in db)
    const sql = `Select * from web_token where web_token=?;`;
    pool.query(sql, [token], async (err, result) => {
      if (result.length) {
        // console.log("Reached Herererere");
        // evaluate jwt
        const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign(
          { uid: data.uid, role: data.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
          // { expiresIn: "60s" }
        );
        console.log("Refreshed");
        res.status(200).json({
          status: 200,
          message: "Succesfully refreshed access token",
          accessToken,
        });
      } else {
        console.log("No user");
        return res.status(401).json({ status: 401, message: "No user found" });
      }
    });
  } catch (error) {
    console.log("Invalid Token");
    res.json({
      status: 403,
      message: "Please authenticate using a valid refresh token",
    });
  }
};

module.exports = { verifyToken };
