
require('dotenv').config();

const express = require('express');
const path = require('path');

const config = require('./config');
const db = require('./config/database');
const logger = require('./middlewares/logger');
const routes = require('./routes');

const app = express();

// Konfigurasi EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/', routes);

// Halaman / endpoint tidak ditemukan
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
            sukses: false,
            pesan: 'Endpoint tidak ditemukan'
        });
    }

    res.status(404).send('Halaman tidak ditemukan');
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        sukses: false,
        pesan: process.env.NODE_ENV === 'production'
            ? 'Terjadi kesalahan server'
            : err.message
    });
});

// Jalankan server setelah database terhubung
async function startServer() {
    try {
        await db.query('SELECT NOW()');

        console.log('PostgreSQL berhasil terhubung!');

        app.listen(config.port, () => {
            console.log(
                `MediChat berjalan di http://localhost:${config.port}`
            );
            console.log('API Status: /api/status');
            console.log('API Produk: /api/produk');
        });

    } catch (error) {
        console.error(
            'Koneksi database gagal:',
            error.message
        );

        process.exit(1);
    }
}

startServer();