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

<h2>Halaman Utama Web</h2>
<img width="1917" height="1082" alt="image" src="https://github.com/user-attachments/assets/62469504-c231-4f03-8066-e95572153c87" />

<h2>Halaman Chat Bot</h2>
<img width="1917" height="1092" alt="image" src="https://github.com/user-attachments/assets/1921aa47-b82c-4835-a47c-7d897a966ae3" />

<h2>Halaman Admin Login </h2>
<img width="1917" height="1087" alt="image" src="https://github.com/user-attachments/assets/b1b730eb-e266-497d-8dd3-f9c719e5c33d" />

<h2>Halaman Input Data Admin</h2>
<img width="1901" height="1092" alt="image" src="https://github.com/user-attachments/assets/e3782a8f-df58-4d27-b2ff-64828b62423e" />

<h2>Halaman Utama Mobile</h2>
<img width="512" height="1007" alt="image" src="https://github.com/user-attachments/assets/4ae1eb0f-16ac-48c5-a4d6-c9726810a603" />


