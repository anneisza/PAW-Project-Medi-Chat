// ini rev
//file baru
const makeModel = require('../utils/makeModel');
const { RJ, VISITE } = require('../utils/kategori');

module.exports = makeModel({
  table: 'biaya',
  columns: ['kategori', 'nama', 'tarif', 'umum', 'cito'],
  orderBy: `CASE kategori WHEN '${RJ}' THEN 1 WHEN '${VISITE}' THEN 2 ELSE 3 END, id`,
});