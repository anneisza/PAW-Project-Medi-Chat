// Controller autentikasi admin: login, logout, me
const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');

// Nama cookie default express-session (ubah jika server.js memakai nama lain)
const COOKIE_NAME = 'connect.sid';

// Pesan sama untuk username salah maupun password salah
const PESAN_LOGIN_GAGAL = 'Username atau password salah';

// Hash palsu supaya waktu respons tetap mirip saat username tidak ditemukan
const DUMMY_HASH = bcrypt.hashSync('dummy-password-untuk-timing', 10);

// Format respons seragam {success, message, data}
function kirim(res, status, success, message, data = null) {
  return res.status(status).json({ success, message, data });
}

// POST /api/admin/login
async function login(req, res) {
  try {
    const body = req.body || {};
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    // Validasi input
    if (!username || !password) {
      return kirim(res, 400, false, 'Username dan password wajib diisi');
    }
    if (username.length > 50 || password.length > 128) {
      return kirim(res, 400, false, 'Format username atau password tidak valid');
    }

    // Cek ke database, tetap jalankan bcrypt.compare walau user tidak ada
    const admin = await adminModel.getByUsername(username);
    const hash = admin ? admin.password_hash : DUMMY_HASH;
    
    // (Log debugging sudah dihapus agar bersih)
    const cocok = await bcrypt.compare(password, hash);

    if (!admin || !cocok) {
      return kirim(res, 401, false, PESAN_LOGIN_GAGAL);
    }

    // Buat sesi baru (cegah session fixation), lalu simpan data admin
    req.session.regenerate((errRegen) => {
      if (errRegen) {
        console.error('Gagal regenerate sesi:', errRegen.message);
        return kirim(res, 500, false, 'Terjadi kesalahan pada server');
      }

      req.session.adminId = admin.id;
      req.session.adminUsername = admin.username;

      req.session.save((errSave) => {
        if (errSave) {
          console.error('Gagal menyimpan sesi:', errSave.message);
          return kirim(res, 500, false, 'Terjadi kesalahan pada server');
        }
        return kirim(res, 200, true, 'Login berhasil', {
          id: admin.id,
          username: admin.username,
        });
      });
    });
  } catch (err) {
    console.error('Login admin gagal:', err.message);
    return kirim(res, 500, false, 'Terjadi kesalahan pada server');
  }
}

// POST /api/admin/logout
function logout(req, res) {
  const opsiCookie = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  // Tidak ada sesi: anggap sudah logout
  if (!req.session) {
    res.clearCookie(COOKIE_NAME, opsiCookie);
    return kirim(res, 200, true, 'Logout berhasil');
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Gagal menghapus sesi:', err.message);
      return kirim(res, 500, false, 'Terjadi kesalahan pada server');
    }
    res.clearCookie(COOKIE_NAME, opsiCookie);
    return kirim(res, 200, true, 'Logout berhasil');
  });
}

// GET /api/admin/me
function me(req, res) {
  if (req.session && req.session.adminId) {
    return kirim(res, 200, true, 'Sudah login', {
      loggedIn: true,
      id: req.session.adminId,
      username: req.session.adminUsername,
    });
  }
  return kirim(res, 200, true, 'Belum login', { loggedIn: false });
}

module.exports = { login, logout, me };