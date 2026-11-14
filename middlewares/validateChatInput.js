// Middleware validasi input chat + filter prompt injection berbasis pola

const MAX_LENGTH = 500;

// Pola injection (Indonesia & Inggris). Sengaja dibuat spesifik
// supaya pertanyaan medis normal tidak ikut terblokir.
const INJECTION_PATTERNS = [
  // Indonesia: "abaikan instruksi sebelumnya", "lupakan semua aturan"
  /\b(abaikan|lupakan|hiraukan|kesampingkan|acuhkan)\b(?:\s+\S+){0,3}\s+(instruksi|perintah|aturan|petunjuk|arahan|prompt)\b(?:\s+\S+){0,3}\s+(sebelumnya|di atas|tadi|awal|sistem)/,
  /\b(abaikan|lupakan|hiraukan|kesampingkan|acuhkan)\s+(semua|seluruh|segala)\s+(instruksi|perintah|aturan|petunjuk|arahan)\b(?!\s+(dari\s+)?(dokter|obat|medis|perawat|apoteker))/,
  // Inggris: "ignore previous instructions", "disregard all rules"
  /\b(ignore|disregard|forget|override|bypass)\b(?:\s+\w+){0,3}\s+(previous|prior|above|earlier|preceding|all|your|system)\s+(\w+\s+)?(instructions?|prompts?|rules?|guidelines?|directions?|restrictions?)/,
  // Membocorkan / menyinggung system prompt
  /system\s*prompt/,
  /prompt\s*(sistem|awal|rahasia)/,
  /instruksi\s*(sistem|awal|rahasia)/,
  //rev
  /\b(reveal|show|print|repeat|tampilkan|tunjukkan|bocorkan|ungkapkan)\b(?:\s+\S+){0,4}\s+(prompt|instruksimu|(?:your|system|previous|initial)\s+instructions)\b/,
  // Mengubah peran
  /\b(kamu|anda|engkau)\s+(sekarang|kini)\s+(adalah|jadi|menjadi)\b/,
  /\byou\s+are\s+now\b/,
  /\bfrom\s+now\s+on,?\s+you\b/,
  /\bact\s+as\b/,
  /\bpretend\s+(to\s+be|you\s+are|you're)\b/,
  /\bberpura-?pura\s+(jadi|menjadi|sebagai)\b/,
  /\bbertindaklah?\s+sebagai\b/,
  /\broleplay\s+(as|sebagai)\b/,
  // Jailbreak
  /jail\s*-?\s*break/,
  /\bdo\s+anything\s+now\b/,
  /\bdeveloper\s+mode\b/,
  /\bmode\s+(pengembang|developer|bebas)\b/,
  // Mengincar API key
  /\b(gemini[_\s-]?api[_\s-]?key|api[_\s-]?key|kunci\s+api)\b/,
  // Token/delimiter template chat
  /<\|[^|]*\|>/,
  /\[\/?inst\]/,
  /<<\s*\/?sys\s*>>/,
  /```\s*system/,
];

// Penanda role di awal baris, mis. "system: ..." (cek dengan newline dipertahankan)
const ROLE_MARKER = /(^|\n)\s*(system|assistant|developer)\s*:/;

// Normalisasi: unicode, hapus karakter zero-width, huruf kecil
function normalize(text) {
  return text
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
    .toLowerCase();
}

function detectInjection(text) {
  const lower = normalize(text);
  const flat = lower.replace(/\s+/g, ' ');
  if (ROLE_MARKER.test(lower)) return true;
  return INJECTION_PATTERNS.some((pattern) => pattern.test(flat));
}

function reject(res, code, message) {
  return res.status(code).json({ success: false, message, data: null });
}

function validateChatInput(req, res, next) {
  const message = req.body ? req.body.message : undefined;

  // Harus ada dan bertipe string
  if (message === undefined || message === null) {
    return reject(res, 400, 'Pesan tidak boleh kosong.');
  }
  if (typeof message !== 'string') {
    return reject(res, 400, 'Format pesan tidak valid.');
  }

  // Trim lalu cek kosong
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return reject(res, 400, 'Pesan tidak boleh kosong.');
  }

  // Batas panjang
  if (trimmed.length > MAX_LENGTH) {
    return reject(res, 400, `Pesan terlalu panjang (maksimal ${MAX_LENGTH} karakter).`);
  }

  // Filter prompt injection
  if (detectInjection(trimmed)) {
    console.warn('[validateChatInput] Pesan diblokir: terindikasi prompt injection');
    return reject(
      res,
      400,
      'Pesan tidak dapat diproses. Silakan ajukan pertanyaan seputar layanan Puskesmas atau informasi kesehatan umum.'
    );
  }

  // Simpan versi yang sudah bersih untuk controller
  req.body.message = trimmed;
  return next();
}

module.exports = validateChatInput;
// module.exports.validateChatInput = validateChatInput; // jaga-jaga kalau di-import bernama