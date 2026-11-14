//ini rev
const model = require('../models/jadwalModel');
const makeController = require('../utils/makeController');

// "08.00" atau "08:00" menjadi menit; null kalau format salah
const toMenit = (s) => {
  const m = /^([01]?\d|2[0-3])[:.]([0-5]\d)$/.exec(s);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

// Format jam: "08.00 - 12.00"
const cekJam = (v) => {
  const p = v.split(/\s*-\s*/);
  const a = p.length === 2 ? toMenit(p[0]) : null;
  const b = p.length === 2 ? toMenit(p[1]) : null;
  if (a === null || b === null) return 'Jam harus berformat "08.00 - 12.00"';
  if (a >= b) return 'Jam mulai harus lebih awal dari jam selesai';
  return null;
};

module.exports = makeController({
  model,
  label: 'jadwal',
  fields: [
    { key: 'layanan', label: 'Layanan', type: 'text', max: 100 },
    { key: 'dokter', label: 'Nama dokter', type: 'text', max: 100 },
    { key: 'ruangan', label: 'Ruangan', type: 'text', max: 100 },
    { key: 'hari', label: 'Hari', type: 'text', max: 50 },
    { key: 'jam', label: 'Jam', type: 'text', max: 50, check: cekJam },
    {
      key: 'status',
      label: 'Status',
      type: 'enum',
      options: ['Tersedia', 'Penuh', 'Libur'],
      default: 'Tersedia',
    },
  ],
});