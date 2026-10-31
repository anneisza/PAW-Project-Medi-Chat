
const express = require('express');
const path = require('path');

const app = express();

// Import middleware
const logger = require('./middlewares/logger');

// Import routes
const halamanRoutes = require('./routes/web');
const apiRoutes = require('./routes');

// Import utils
const { formatRupiah } = require('./utils/format');

// Konfigurasi EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper untuk seluruh halaman EJS
app.locals.formatRupiah = formatRupiah;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/', halamanRoutes);
app.use('/api', apiRoutes);

// Jalankan server
const PORT = 3000;

app.listen(PORT, () => {
  console.log('Puskesmas Sehat berjalan');
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API Status: http://localhost:${PORT}/api/status`);
  console.log(`API Layanan: http://localhost:${PORT}/api/produk`);
});
