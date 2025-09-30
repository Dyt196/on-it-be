import { createPool } from 'mysql2/promise.js';

const db = createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Development
// const db = createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'myroot123', // your MySQL password
//   database: 'malldb'
// })

export default db;