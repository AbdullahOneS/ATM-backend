const mysql = require('mysql2')

// Set up a connection to the MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user:  process.env.DB_USER || "root",
    password: process.env.DB_PASS ||"root",
    database: "anemos"
});

module.exports = { pool }