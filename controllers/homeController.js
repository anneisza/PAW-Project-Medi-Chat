
const { formatRupiah } = require('../utils/format');
const ProdukModel = require('../models/produkModel');
const config = require('../config');

exports.index = (req, res) => {
  res.render('index', {
    judul: `${config.appName} - Layanan Chat Medis`,
    namaToko: config.appName,
    produk: ProdukModel.getAll(),

    // Helper format harga untuk EJS
    formatRupiah: formatRupiah,
  });
};
