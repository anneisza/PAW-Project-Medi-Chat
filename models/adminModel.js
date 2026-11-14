const pool = require('../config/database');

// Ambil satu admin berdasarkan username, null jika tidak ada
async function getByUsername(username) {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1 LIMIT 1',
      [username]
    );
    return rows[0] || null;
  } catch (err) {
    console.error('ERROR DATABASE SAAT CARI ADMIN:', err.message);
    throw err; 
  }
}

module.exports = { getByUsername };