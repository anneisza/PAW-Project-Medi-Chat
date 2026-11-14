//ini rev
//file baru
const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/status', apiController.status);

module.exports = router;