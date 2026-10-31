# MVC Express App

Express.js dengan struktur MVC, view EJS, dan styling Tailwind CDN. Data masih hardcode.

## Menjalankan

```bash
npm install
npm start        # atau: npm run dev (auto-reload, Node 18+)
```

Buka http://localhost:3000

## Endpoint

| URL | Keterangan |
|---|---|
| `/` | Landing page (EJS) |
| `/api/status` | Status server (JSON) |
| `/api/produk` | Daftar produk (JSON) |

Setiap request dicatat di `logs/logger.md`.

## Struktur

```
config/        pengaturan aplikasi (port, nama, lokasi log)
models/        data produk (hardcode)
middlewares/   logger ke file .md
controllers/   logika untuk halaman dan API
routes/        pemetaan URL ke controller
views/         template EJS + partials
server.js      titik masuk aplikasi
```
