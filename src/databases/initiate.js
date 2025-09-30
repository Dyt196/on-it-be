import { createPool } from 'mysql2/promise.js';

const db = createPool({
  host: 'localhost',
  user: 'root',
  password: 'myroot123', // your MySQL password
  database: 'malldb'
});

export default db;