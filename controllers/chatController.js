// Controller chat: meneruskan pesan ke Gemini dan membalas {reply}

const { askGemini } = require('../services/geminiService');
const sendResponse = require('../utils/response');

const GENERIC_ERROR =
  'Maaf, layanan chatbot sedang tidak tersedia. Silakan coba lagi beberapa saat lagi.';

// Kode error dari geminiService yang pesannya aman ditampilkan ke pengunjung
const KODE_AMAN = new Set([
  'INVALID_INPUT', 'NO_KEY', 'TIMEOUT', 'QUOTA',
  'AUTH', 'BLOCKED', 'EMPTY', 'UNAVAILABLE',
]);

// Sensor API key kalau tidak sengaja muncul di pesan error (untuk log saja)
function sanitizeForLog(text) {
  const key = process.env.GEMINI_API_KEY;
  let result = String(text);
  if (key) result = result.split(key).join('[DISEMBUNYIKAN]');
  return result;
}

async function chat(req, res) {
  try {
    // req.body.message sudah divalidasi dan di-trim oleh validateChatInput
    const reply = await askGemini(req.body.message);

    return sendResponse(res, {
      message: 'Berhasil',
      data: { reply },
    });
  } catch (err) {
    console.error(
      '[chatController] Gagal memproses chat:',
      err && err.code ? err.code : '',
      sanitizeForLog(err && err.message)
    );

    const dikenal = err && KODE_AMAN.has(err.code);
    return sendResponse(res, {
      code: dikenal ? err.status : 502,
      success: false,
      message: dikenal ? err.message : GENERIC_ERROR,
    });
  }
}

module.exports = { chat };