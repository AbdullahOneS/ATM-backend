const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const verifyToken = (req, res, next) => {
  console.log("refresh called");
  const token_header =
    req.header("Authorization") || req.header("authorization");
  console.log(token_header);
  if (!token_header) {
    return res.json({ status: 401, message: "Please add access token" });
  }
  try {
    const token = token_header.split(" ")[1];
    console.log("TOken: ", token);
    const sql = `Select * from web_token where web_token=?;`;
    pool.query(sql, [token], async (err, result) => {
      if (result.length) {
        // evaluate jwt
        jwt.verify(token, process.env.WEB_TOKEN_SECRET);
        next()
      } else {
        console.log("No user with the above token");
        return res.json({ status: 401, message: "Invalid Token" });
      }
    });
  } catch (error) {
    console.log("Invalid Token");
    return res.json({
      status: 403,
      message: "Please authenticate using a valid refresh token",
    });
  }
};

module.exports = { verifyToken };
