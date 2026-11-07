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

exports.produk = async (req, res, next) => {
  try {
    const data = await ProdukModel.getAll();
    res.json({
      sukses: true,
      jumlah: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Validasi input
function validasiProduk(body) {
    const errors = [];

    if (!body.nama || !body.nama.trim())
        errors.push('Nama wajib diisi');

    if (!body.kategori || !body.kategori.trim())
        errors.push('Kategori wajib diisi');

    if (
        body.harga === '' ||
        body.harga === undefined ||
        !Number.isFinite(Number(body.harga)) ||
        Number(body.harga) < 0
    ) {
        errors.push('Harga harus berupa angka positif atau nol');
    }

    if (!body.jadwal || !body.jadwal.trim())
        errors.push('Jadwal wajib diisi');

    if (!body.jam || !body.jam.trim())
        errors.push('Jam wajib diisi');

    return errors;
}

function payload(body) {
    return {
        nama: body.nama.trim(),
        kategori: body.kategori.trim(),
        harga: Number(body.harga),
        jadwal: body.jadwal.trim(),
        jam: body.jam.trim()
    };
}

function idValid(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

// GET ALL
exports.getAllProduk = async (req, res, next) => {
    try {
        const data = await ProdukModel.getAll();

        res.json({
            sukses: true,
            jumlah: data.length,
            data
        });
    } catch (error) {
        next(error);
    }
};

// GET BY ID
exports.getProdukById = async (req, res, next) => {
    try {
        if (!idValid(req.params.id)) {
            return res.status(400).json({
                sukses: false,
                pesan: 'ID tidak valid'
            });
        }

        const data = await ProdukModel.getById(req.params.id);

        if (!data) {
            return res.status(404).json({
                sukses: false,
                pesan: 'Produk tidak ditemukan'
            });
        }

        res.json({
            sukses: true,
            data
        });
    } catch (error) {
        next(error);
    }
};

// POST
exports.createProduk = async (req, res, next) => {
    try {
        const errors = validasiProduk(req.body);

        if (errors.length) {
            return res.status(400).json({
                sukses: false,
                errors
            });
        }

        const data = await ProdukModel.create(payload(req.body));

        res.status(201).json({
            sukses: true,
            pesan: 'Produk berhasil ditambahkan',
            data
        });
    } catch (error) {
        next(error);
    }
};

// PUT
exports.updateProduk = async (req, res, next) => {
    try {
        if (!idValid(req.params.id)) {
            return res.status(400).json({
                sukses: false,
                pesan: 'ID tidak valid'
            });
        }

        const errors = validasiProduk(req.body);

        if (errors.length) {
            return res.status(400).json({
                sukses: false,
                errors
            });
        }

        const data = await ProdukModel.update(
            req.params.id,
            payload(req.body)
        );

        if (!data) {
            return res.status(404).json({
                sukses: false,
                pesan: 'Produk tidak ditemukan'
            });
        }

        res.json({
            sukses: true,
            pesan: 'Produk berhasil diperbarui',
            data
        });
    } catch (error) {
        next(error);
    }
};

// DELETE
exports.deleteProduk = async (req, res, next) => {
    try {
        if (!idValid(req.params.id)) {
            return res.status(400).json({
                sukses: false,
                pesan: 'ID tidak valid'
            });
        }

        const data = await ProdukModel.delete(req.params.id);

        if (!data) {
            return res.status(404).json({
                sukses: false,
                pesan: 'Produk tidak ditemukan'
            });
        }

        res.json({
            sukses: true,
            pesan: 'Produk berhasil dihapus',
            data
        });
    } catch (error) {
        next(error);
    }
};

