//rev, dari repo asli
const fs = require('fs');
const path = require('path');
const config = require('../config');

const logPath = path.join(
    config.logDir,
    config.logFile
);

fs.mkdirSync(config.logDir, {
    recursive: true
});

if (!fs.existsSync(logPath)) {
    fs.writeFileSync(
        logPath,
        '# Log Request\n\n' +
        '| Waktu | Method | URL | Status | Durasi |\n' +
        '|---|---|---|---|---|\n'
    );
}

module.exports = (req, res, next) => {

    const mulai = process.hrtime.bigint();

    res.on('finish', () => {

        const waktu = new Date().toLocaleString(
            'id-ID',
            { timeZone: 'Asia/Jakarta' }
        );

        const durasi =
            Number(process.hrtime.bigint() - mulai) / 1e6;

        console.log(
            `[${waktu}] ${req.method} ${req.originalUrl} - ${res.statusCode}`
        );

        const baris =
            `| ${waktu} | ${req.method} | ${req.originalUrl} | ${res.statusCode} | ${durasi.toFixed(1)} ms |\n`;

        fs.appendFile(logPath, baris, (err) => {
            if (err) {
                console.error('Gagal menyimpan log:', err.message);
            }
        });
    });

    next();
};