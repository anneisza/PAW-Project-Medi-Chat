require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

const config = require('./config');
const db = require('./config/database');
const logger = require('./middlewares/logger');
const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || config.sessionSecret || 'medichat-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

app.use(logger);

app.use('/', routes);

app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            message: 'Endpoint tidak ditemukan'
        });
    }

    res.status(404).send('Halaman tidak ditemukan');
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Terjadi kesalahan server'
            : err.message
    });
});

async function startServer() {
    try {
        await db.query('SELECT NOW()');
        console.log('PostgreSQL berhasil terhubung!');

        app.listen(config.port, () => {
            console.log(`MediChat berjalan di http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error('Koneksi database gagal:', error.message);
        process.exit(1);
    }
}

startServer();