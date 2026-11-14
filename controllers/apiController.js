//rev file baru
const config = require('../config');
const sendResponse = require('../utils/response');

exports.status = (req, res) => {
  sendResponse(res, {
    message: 'Server berjalan',
    data: {
      aplikasi: config.appName,
      uptimeDetik: Math.round(process.uptime()),
      waktuServer: new Date().toISOString(),
    },
  });
};