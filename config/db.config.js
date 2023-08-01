import { createPool } from 'mysql2';

// Set up a connection to the MySQL database
const pool = createPool({
    host: process.env.DB_HOST || "localhost",
    user:  process.env.DB_USER || "root",
    password: process.env.DB_PASS ||"root",
    database: "anemos"
});

export default { pool }