const sendResponse = require('../utils/response');

// Untuk API: balas 401 JSON
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.adminId) return next();
  return sendResponse(res, {
    code: 401,
    success: false,
    message: 'Silakan login sebagai admin terlebih dahulu',
  });
}

// Untuk halaman: arahkan ke form login
function requireAdminPage(req, res, next) {
  if (req.session && req.session.adminId) return next();
  return res.redirect('/admin/login');
}

module.exports = { requireAdminAuth, requireAdminPage };