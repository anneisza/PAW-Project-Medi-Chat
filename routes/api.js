const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/status', apiController.status);
router.get('/produk', apiController.produk);
router.get('/produk/:id', apiController.getProdukById);

router.post('/produk', apiController.createProduk);
router.put('/produk/:id', apiController.updateProduk);
router.delete('/produk/:id', apiController.deleteProduk);

module.exports = router;

