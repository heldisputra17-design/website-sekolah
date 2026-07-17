const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await connection.query(`USE \`${process.env.DB_NAME}\``);

  const sql = require('fs').readFileSync('../database.sql', 'utf8');
  const statements = sql.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    try { await connection.query(stmt); } catch (e) { /* ignore */ }
  }

  const hash = await bcrypt.hash('admin123', 10);
  await connection.query(
    'UPDATE users SET password = ? WHERE username = ?',
    [hash, 'admin']
  );

  console.log('Database seeded successfully!');
  console.log('Admin login: username=admin, password=admin123');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
