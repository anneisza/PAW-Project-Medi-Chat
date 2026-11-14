//ini rev
//ini file baru

const model = require('../models/pengumumanModel');
const makeController = require('../utils/makeController');

module.exports = makeController({
  model,
  label: 'pengumuman',
  fields: [
    { key: 'judul', label: 'Judul', type: 'text', max: 150 },
    { key: 'tanggal', label: 'Tanggal', type: 'date' },
    { key: 'isi', label: 'Isi pengumuman', type: 'text', max: 1000 },
  ],
});