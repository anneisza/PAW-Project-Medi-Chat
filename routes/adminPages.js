const express = require('express');
const { requireAdminPage } = require('../middlewares/auth');

const router = express.Router();

router.get('/admin/login', (req, res) => {
  if (req.session && req.session.adminId) return res.redirect('/admin');
  res.render('admin/login');
});

router.get('/admin', requireAdminPage, (req, res) => {
  res.render('admin/dashboard');
});

module.exports = router;