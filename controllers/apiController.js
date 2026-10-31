const ProdukModel = require('../models/produkModel');
const config = require('../config');

exports.status = (req, res) => {
  res.json({
    status: 'ok',
    aplikasi: config.appName,
    uptimeDetik: Math.round(process.uptime()),
    waktuServer: new Date().toISOString(),
  });
};

exports.produk = (req, res) => {
  const data = ProdukModel.getAll();
  res.json({
    sukses: true,
    jumlah: data.length,
    data,
  });
};
