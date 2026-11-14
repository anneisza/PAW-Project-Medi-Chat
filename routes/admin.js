// Route autentikasi admin (di-mount di /api/admin oleh server.js)
const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/me', adminController.me);

module.exports = router;