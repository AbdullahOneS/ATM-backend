const { log } = require('console');
const mysql = require('mysql2')

// Set up a connection to the MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user:  process.env.DB_USER || "root",
    password: process.env.DB_PASS ||"root",
    database: "atm"
});

pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
  
    console.log('Connected to MySQL database!');
    // Perform any database operations here if needed
  
    // Release the connection when done
    connection.release();
  });

  
module.exports = { pool }