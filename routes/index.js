const express = require('express');
const webRoutes = require('./web');
const apiRoutes = require('./api');

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/', webRoutes);

module.exports = router;
