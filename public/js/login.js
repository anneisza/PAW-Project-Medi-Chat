const form = document.getElementById('login-form');
const error = document.getElementById('error');
const tombol = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  error.hidden = true;

  const username = document.getElementById('user').value.trim();
  const password = document.getElementById('pass').value;

  tombol.disabled = true;
  tombol.textContent = 'Memproses...';

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    let hasil = {};
    try {
      hasil = await res.json();
    } catch (_) {
      /* bukan JSON */
    }

    if (!res.ok || !hasil.success) {
      throw new Error(hasil.message || 'Login gagal');
    }
    location.href = '/admin';
  } catch (err) {
    error.textContent =
      err instanceof TypeError ? 'Tidak dapat terhubung ke server.' : err.message;
    error.hidden = false;
    tombol.disabled = false;
    tombol.textContent = 'Masuk';
  }
});