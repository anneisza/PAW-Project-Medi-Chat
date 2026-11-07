const { formatRupiah } = require('../utils/format');
const ProdukModel = require('../models/produkModel');
const config = require('../config');

exports.index = async (req, res, next) => {
  try {
    const daftarProduk = await ProdukModel.getAll();

    res.render('index', {
      judul: `${config.appName} - Layanan Chat Medis`,
      namaToko: config.appName,
      produk: daftarProduk,

      // Helper format harga untuk EJS
      formatRupiah: formatRupiah,
    });
  } catch (error) {
    next(error);
  }
};
