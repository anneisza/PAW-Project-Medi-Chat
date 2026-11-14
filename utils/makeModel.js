//ini rev
//file baru
const pool = require('../config/database');

// Nama tabel dan kolom hanya dari kode (konstanta); nilai selalu lewat $1, $2, ...
function makeModel({ table, columns, select = '*', orderBy = 'id' }) {
  const daftar = columns.join(', ');
  const placeholder = columns.map((_, i) => `$${i + 1}`).join(', ');
  const setKolom = columns.map((c, i) => `${c} = $${i + 1}`).join(', ');
  const nilai = (d) => columns.map((c) => d[c]);

  return {
    async getAll() {
      const { rows } = await pool.query(
        `SELECT ${select} FROM ${table} ORDER BY ${orderBy}`
      );
      return rows;
    },

    async getById(id) {
      const { rows } = await pool.query(
        `SELECT ${select} FROM ${table} WHERE id = $1`,
        [id]
      );
      return rows[0] || null;
    },

    async create(d) {
      const { rows } = await pool.query(
        `INSERT INTO ${table} (${daftar}) VALUES (${placeholder}) RETURNING ${select}`,
        nilai(d)
      );
      return rows[0];
    },

    async update(id, d) {
      const { rows } = await pool.query(
        `UPDATE ${table} SET ${setKolom}, updated_at = NOW()
          WHERE id = $${columns.length + 1} RETURNING ${select}`,
        [...nilai(d), id]
      );
      return rows[0] || null;
    },

    async remove(id) {
      const { rows } = await pool.query(
        `DELETE FROM ${table} WHERE id = $1 RETURNING ${select}`,
        [id]
      );
      return rows[0] || null;
    },
  };
}

module.exports = makeModel;