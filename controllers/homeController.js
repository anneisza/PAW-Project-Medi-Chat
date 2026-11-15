const config = require('../config');
const JadwalModel = require('../models/jadwalModel');
const BiayaModel = require('../models/biayaModel');
const PengumumanModel = require('../models/pengumumanModel');
const prosedur = require('../utils/prosedur');
const kat = require('../utils/kategori');

const keDate = (nilai) =>
  nilai instanceof Date
    ? nilai
    : new Date(`${String(nilai).slice(0, 10)}T00:00:00`);

const tanggalID = (nilai) => {
  const d = keDate(nilai);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatRupiah = (nilai) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(nilai));

exports.index = async (req, res, next) => {
  try {
    const semua = await PengumumanModel.getAll();
    const pengumuman = [...semua]
      .sort((a, b) => keDate(b.tanggal) - keDate(a.tanggal))
      .slice(0, 3)
      .map((p) => ({ ...p, tanggalTampil: tanggalID(p.tanggal) }));
    res.render('index', {
      judul: `${config.appName} - Informasi Layanan Puskesmas`,
      pengumuman,
      isAdmin: req.session && req.session.adminId ? true : false,
    });
  } catch (error) {
    next(error);
  }
};

exports.informasi = async (req, res, next) => {
  try {
    const [jadwal, biaya] = await Promise.all([
      JadwalModel.getAll(),
      BiayaModel.getAll(),
    ]);
    res.render('informasi', {
      judul: `Informasi - ${config.appName}`,
      jadwal,
      biaya,
      prosedur,
      kat,
      formatRupiah,
      adminContact: config.adminContact || '',
      isAdmin: req.session && req.session.adminId ? true : false,
    });
  } catch (error) {
    next(error);
  }
};

exports.medichat = (req, res) => {
  const rawWa = String(process.env.WHATSAPP_ADMIN || '6280320240303').replace(/\D/g, '');
  const waAdmin = rawWa.startsWith('0') ? `62${rawWa.slice(1)}` : rawWa;

  res.render('medichat', {
    judul: `Konsultasi - ${config.appName}`,
    isAdmin: req.session && req.session.adminId ? true : false,
    adminContact: config.adminContact || '',
    waAdmin,
  });
};