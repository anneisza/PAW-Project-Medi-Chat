//ini rev
//file baru
const makeModel = require('../utils/makeModel');

module.exports = makeModel({
  table: 'pengumuman',
  columns: ['judul', 'tanggal', 'isi'],
  select: "id, judul, to_char(tanggal, 'YYYY-MM-DD') AS tanggal, isi",
  orderBy: 'tanggal DESC, id DESC',
});