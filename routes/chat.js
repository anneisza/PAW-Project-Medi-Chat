//ini rev, file baru
const express = require('express');
const validateChatInput = require('../middlewares/validateChatInput');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/', validateChatInput, chatController.chat);

module.exports = router;