//rev, file baru
const form = document.getElementById('chat-form');
const input = document.getElementById('pertanyaan');
const box = document.getElementById('chat-messages');

// Hanya jalan di halaman yang punya elemen chat
if (form && input && box) {
  const tombol = form.querySelector('button[type="submit"]');
  const MAX = 500;
  let mengirim = false;

  // Tambah bubble; textContent agar aman dari XSS
  const tambah = (teks, tipe) => {
    const el = document.createElement('div');
    el.className = 'msg ' + tipe;
    el.textContent = teks;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
    return el;
  };

  const aturLoading = (aktif) => {
    mengirim = aktif;
    if (tombol) tombol.disabled = aktif;
    input.disabled = aktif;
  };

  // data bisa berupa string atau { reply }
  const ambilBalasan = (data) =>
    typeof data === 'string' ? data : data && data.reply;

  const kirim = async (teks) => {
    const q = teks.trim();
    if (mengirim || !q) return;
    if (q.length > MAX) {
      tambah(`Pesan terlalu panjang (maksimal ${MAX} karakter).`, 'bot');
      return;
    }

    tambah(q, 'user');
    aturLoading(true);

    const loading = tambah('Medi-Chat sedang mengetik...', 'bot');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });

      let hasil = {};
      try {
        hasil = await res.json();
      } catch (_) {
        /* bukan JSON */
      }

      loading.remove();

      if (!res.ok || !hasil.success) {
        throw new Error(hasil.message || 'Pesan belum bisa dikirim.');
      }

      const balasan = ambilBalasan(hasil.data);
      if (!balasan) throw new Error('Balasan dari server kosong.');

      tambah(balasan, 'bot');
    } catch (err) {
      loading.remove();
      tambah(
        err instanceof TypeError
          ? 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.'
          : err.message,
        'bot'
      );
    } finally {
      aturLoading(false);
      input.focus();
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = '';
    kirim(q);
  });

  document.querySelectorAll('.chip').forEach((b) =>
    b.addEventListener('click', () => kirim(b.textContent))
  );

  // Pertanyaan awal lewat URL: /medichat?q=...
  const awal = new URLSearchParams(location.search).get('q');
  if (awal) kirim(awal);
}