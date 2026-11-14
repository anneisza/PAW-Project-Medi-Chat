//ini rev
const makeModel = require('../utils/makeModel');

module.exports = makeModel({
  table: 'jadwal',
  columns: ['layanan', 'dokter', 'ruangan', 'hari', 'jam', 'status'],
  orderBy: 'id',
});


// // Model jadwal dokter (raw SQL, query berparameter)
// const pool = require('../config/db');

// const getAll = async () => {
//   const { rows } = await pool.query('SELECT * FROM jadwal ORDER BY id ASC');
//   return rows;
// };

// const getById = async (id) => {
//   const { rows } = await pool.query('SELECT * FROM jadwal WHERE id = $1', [id]);
//   return rows[0] || null;
// };

// const create = async ({ layanan, dokter, ruangan, hari, jam, status }) => {
//   const { rows } = await pool.query(
//     `INSERT INTO jadwal (layanan, dokter, ruangan, hari, jam, status, created_at, updated_at)
//      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
//      RETURNING *`,
//     [layanan, dokter, ruangan, hari, jam, status]
//   );
//   return rows[0];
// };

// const update = async (id, { layanan, dokter, ruangan, hari, jam, status }) => {
//   const { rows } = await pool.query(
//     `UPDATE jadwal
//      SET layanan = $1, dokter = $2, ruangan = $3, hari = $4, jam = $5, status = $6, updated_at = NOW()
//      WHERE id = $7
//      RETURNING *`,
//     [layanan, dokter, ruangan, hari, jam, status, id]
//   );
//   return rows[0] || null;
// };

// const remove = async (id) => {
//   const { rows } = await pool.query('DELETE FROM jadwal WHERE id = $1 RETURNING *', [id]);
//   return rows[0] || null;
// };

// module.exports = { getAll, getById, create, update, remove };