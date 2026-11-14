//ini rev
//file baru

const model = require('../models/biayaModel');
const makeController = require('../utils/makeController');
const kat = require('../utils/kategori');

module.exports = makeController({
  model,
  label: 'biaya',
  // tarif dr. umum dan cito wajib hanya untuk kategori Visite
  fields: (body) => {
    const visite = body.kategori === kat.VISITE;
    return [
      { key: 'kategori', label: 'Kategori', type: 'enum', options: kat.SEMUA },
      { key: 'nama', label: 'Tindakan / Kelas', type: 'text', max: 150 },
      { key: 'tarif', label: 'Tarif', type: 'int' },
      { key: 'umum', label: 'Tarif dr. Umum', type: 'int', required: visite },
      { key: 'cito', label: 'Cito/Libur dr. Spesialis', type: 'int', required: visite },
    ];
  },
  // kategori selain Visite: umum dan cito dikosongkan
  prepare: (d) => (d.kategori === kat.VISITE ? d : { ...d, umum: null, cito: null }),
});