const express = require('express');
const router = express.Router();
const { requireAdminPage } = require('../middlewares/auth');

router.get('/admin/login', (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    judul: 'Login Admin - Medi-Chat'
  });
});

router.get('/admin', requireAdminPage, (req, res) => {
  res.render('admin/dashboard', {
    judul: 'Dashboard Admin - Medi-Chat',
    admin: { username: req.session.adminUsername || 'Admin' }
  });
});

module.exports = router;