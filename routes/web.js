
const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.index);
router.get('/informasi', homeController.informasi);
router.get('/medichat', homeController.medichat);

module.exports = router;