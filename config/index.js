const path = require('path');

module.exports = {
  appName: 'MediChat',
  port: process.env.PORT || 3000,
  logDir: path.join(__dirname, '..', 'logs'),
  logFile: 'logger.md',
};
