const express = require('express');

const router = express.Router();

router.use('/api/admin', require('./admin'));
router.use('/api/jadwal', require('./jadwal'));
router.use('/api/biaya', require('./biaya'));
router.use('/api/pengumuman', require('./pengumuman'));
router.use('/api/chat', require('./chat'));
router.use('/api', require('./api'));

router.use('/', require('./adminPages'));
router.use('/', require('./web'));

module.exports = router;
