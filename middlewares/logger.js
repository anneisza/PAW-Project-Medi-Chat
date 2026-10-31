
const fs = require('fs');
const path = require('path');
const config = require('../config');

const logPath = path.join(config.logDir, config.logFile);

// Siapkan folder penyimpanan log
fs.mkdirSync(config.logDir, { recursive: true });

// Buat file log jika belum tersedia
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(
    logPath,
    '# Log Request\n\n' +
      '| Waktu | Method | URL | Status | Durasi | IP |\n' +
      '|---|---|---|---|---|---|\n'
  );
}

// Escape karakter agar tabel Markdown tetap rapi
const aman = (teks) =>
  String(teks).replace(/\|/g, '%7C');

module.exports = (req, res, next) => {
  const mulai = process.hrtime.bigint();

  // Catat setelah response selesai
  res.on('finish', () => {
    const waktu = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta'
    });

    const durasiMs =
      Number(process.hrtime.bigint() - mulai) / 1e6;

    const baris =
      `| ${waktu} | ${req.method} | ${aman(req.originalUrl)} ` +
      `| ${res.statusCode} | ${durasiMs.toFixed(1)} ms | ${aman(req.ip)} |\n`;

    // Tampilkan log di terminal VS Code
    console.log(
      `[${waktu}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${durasiMs.toFixed(1)} ms)`
    );

    // Simpan log ke file Markdown
    fs.appendFile(logPath, baris, (err) => {
      if (err) {
        console.error('Gagal menulis log:', err.message);
      }
    });
  });

  next();
};
