// Seed data awal. Aman dijalankan berulang (tidak membuat duplikat).
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { RJ, VISITE, AKOMODASI } = require('../utils/kategori');

const jadwalAwal = [
  ['Dokter Umum', 'dr. Andi Pratama', 'Poli Umum', 'Senin - Sabtu', '08.00 - 14.00'],
  ['Dokter Gigi', 'drg. Siti Rahma', 'Poli Gigi', 'Senin - Kamis', '08.00 - 12.00'],
  ['Imunisasi', 'dr. Budi Santoso', 'Ruang KIA', 'Rabu', '08.00 - 11.00'],
];

// [kategori, nama, tarif, umum, cito]
const biayaAwal = [
  [RJ, 'Pemeriksaan Dokter Spesialis', 90000],
  [RJ, 'Pemeriksaan Dokter Umum', 73000],
  [RJ, 'Pemeriksaan Dokter Gigi', 75000],
  [RJ, 'Pemeriksaan Dokter Umum IGD', 110000],
  [RJ, 'Konsultasi Spesialis IGD', 52000],
  [RJ, 'Konsultasi Dokter Spesialis', 90000],
  [RJ, 'Konsultasi VCT', 82000],
  [RJ, 'Konseling Narkoba', 95000],
  [RJ, 'Konsultasi Gizi dengan Komplikasi', 28000],
  [RJ, 'Konsultasi Gizi', 22000],
  [RJ, 'Asesmen Gizi', 25000],
  [RJ, 'Asesmen Keperawatan', 25000],
  [VISITE, 'Kelas I', 42000, 25000, 63000],
  [VISITE, 'Kelas II', 42000, 25000, 63000],
  [VISITE, 'Kelas III', 42000, 25000, 63000],
  [VISITE, 'VIP', 150000, 50000, 225000],
  [VISITE, 'ICU/NICU', 150000, 50000, 225000],
  [VISITE, 'Isolasi / Intermediet', 42000, 25000, 63000],
  [AKOMODASI, 'VIP', 435000],
  [AKOMODASI, 'Kelas I', 250000],
  [AKOMODASI, 'Kelas II', 185000],
  [AKOMODASI, 'Kelas III', 140000],
  [AKOMODASI, 'ICU/NICU', 445000],
  [AKOMODASI, 'Isolasi / Intermediet', 325000],
  [AKOMODASI, 'One Day Care', 250000],
];

const pengumumanAwal = [
  ['Imunisasi Anak', '2026-10-07', 'Imunisasi anak setiap hari Rabu, 08.00 - 11.00'],
  ['Poli Gigi', '2026-10-08', 'Poli gigi libur pada tanggal merah'],
];

async function isiJikaKosong(tabel, baris, sql) {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS total FROM ${tabel}`);
  if (rows[0].total > 0) {
    console.log(`${tabel}: sudah ada, dilewati`);
    return;
  }
  for (const b of baris) await pool.query(sql, b);
  console.log(`${tabel}: ${baris.length} data ditambahkan`);
}

async function seed() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Tabel siap');

    const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO admins (username, password_hash) VALUES ($1, $2)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', hash]
    );
    console.log('Admin siap: admin');
    if (!process.env.SEED_ADMIN_PASSWORD) {
      console.warn('PERINGATAN: SEED_ADMIN_PASSWORD kosong, memakai password default. Ganti segera.');
    }

    await isiJikaKosong(
      'jadwal',
      jadwalAwal,
      'INSERT INTO jadwal (layanan, dokter, ruangan, hari, jam) VALUES ($1,$2,$3,$4,$5)'
    );
    await isiJikaKosong(
      'biaya',
      biayaAwal.map(([k, n, t, u = null, c = null]) => [k, n, t, u, c]),
      'INSERT INTO biaya (kategori, nama, tarif, umum, cito) VALUES ($1,$2,$3,$4,$5)'
    );
    await isiJikaKosong(
      'pengumuman',
      pengumumanAwal,
      'INSERT INTO pengumuman (judul, tanggal, isi) VALUES ($1,$2,$3)'
    );

    console.log('\nSeeding selesai.');
    process.exit(0);
  } catch (err) {
    console.error('Gagal seeding:', err.message);
    process.exit(1);
  }
}

seed();