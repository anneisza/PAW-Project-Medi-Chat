//ini rev
//folder dan file baru
// Format respons seragam untuk semua API: { success, message, data }
function sendResponse(
  res,
  { code = 200, success = true, message = '', data = null } = {}
) {
  return res.status(code).json({ success, message, data });
}

module.exports = sendResponse;