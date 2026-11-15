document.addEventListener('DOMContentLoaded', () => {
  let jadwalList = [];
  let biayaList = [];
  let pengumumanList = [];

  const alertBox = document.getElementById('alertBox');
  const adminUsernameEl = document.getElementById('adminUsername');
  const btnLogout = document.getElementById('btnLogout');

  function showAlert(message, type = 'success') {
    alertBox.textContent = message;
    alertBox.className = `alert-box show ${type === 'error' ? 'alert-error' : 'alert-success'}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      alertBox.classList.remove('show');
    }, 4500);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatRupiah(value) {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (Number.isNaN(num)) return '-';
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  function parseNumericInput(val) {
    if (val === '' || val === null || val === undefined) return null;
    const num = Number(val);
    return Number.isNaN(num) ? null : num;
  }

  function formatDateInput(dateVal) {
    if (!dateVal) return new Date().toISOString().split('T')[0];
    const d = new Date(dateVal);
    if (Number.isNaN(d.getTime())) return String(dateVal).slice(0, 10);
    return d.toISOString().split('T')[0];
  }

  function formatDateDisplay(dateVal) {
    if (!dateVal) return '-';
    const d = new Date(dateVal);
    if (Number.isNaN(d.getTime())) return escapeHtml(dateVal);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  async function apiRequest(url, options = {}) {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options
    };
    const response = await fetch(url, config);
    if (response.status === 401 || response.status === 403) {
      window.location.href = '/admin/login';
      throw new Error('Sesi berakhir, silakan login kembali.');
    }
    const result = await response.json();
    if (!response.ok || result.success === false) {
      const errMsg =
        result.message ||
        (Array.isArray(result.errors) ? result.errors.join(', ') : 'Terjadi kesalahan pada server.');
      throw new Error(errMsg);
    }
    return result;
  }

  async function loadCurrentAdmin() {
    try {
      const res = await apiRequest('/api/admin/me');
      const userData = res.data || res;
      if (userData && userData.username && adminUsernameEl) {
        adminUsernameEl.textContent = userData.username;
      }
    } catch (_) {}
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      try {
        await apiRequest('/api/admin/logout', { method: 'POST' });
      } catch (_) {
      } finally {
        window.location.href = '/admin/login';
      }
    });
  }

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  const formJadwal = document.getElementById('formJadwal');
  const tbodyJadwal = document.getElementById('tbodyJadwal');
  const countJadwal = document.getElementById('countJadwal');

  function resetJadwalForm() {
    formJadwal.reset();
    document.getElementById('jadwalId').value = '';
    document.getElementById('jadwalFormTitle').textContent = 'Tambah Jadwal Layanan';
    document.getElementById('btnSubmitJadwal').textContent = 'Simpan Jadwal';
  }

  async function loadJadwal() {
    try {
      const res = await apiRequest('/api/jadwal');
      jadwalList = Array.isArray(res.data) ? res.data : [];
      countJadwal.textContent = jadwalList.length;

      if (jadwalList.length === 0) {
        tbodyJadwal.innerHTML = '<tr><td colspan="8" class="empty-row">Belum ada data jadwal layanan.</td></tr>';
        return;
      }

      tbodyJadwal.innerHTML = jadwalList
        .map((item, idx) => {
          const statusLower = String(item.status).toLowerCase();
          let badgeClass = 'badge-closed';
          if (statusLower === 'tersedia') badgeClass = 'badge-open';
          else if (statusLower === 'penuh') badgeClass = 'badge-warning';

          return `
            <tr>
              <td>${idx + 1}</td>
              <td><strong>${escapeHtml(item.layanan)}</strong></td>
              <td>${escapeHtml(item.dokter)}</td>
              <td>${escapeHtml(item.ruangan)}</td>
              <td>${escapeHtml(item.hari)}</td>
              <td>${escapeHtml(item.jam)}</td>
              <td><span class="badge ${badgeClass}">${escapeHtml(item.status)}</span></td>
              <td>
                <div class="action-group">
                  <button type="button" class="btn btn-warning btn-sm" data-action="edit" data-id="${item.id}">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${item.id}">Hapus</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('');
    } catch (err) {
      tbodyJadwal.innerHTML = `<tr><td colspan="8" class="empty-row">${escapeHtml(err.message)}</td></tr>`;
    }
  }

  formJadwal.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('jadwalId').value;
    const submitBtn = document.getElementById('btnSubmitJadwal');

    const payload = {
      layanan: document.getElementById('jadwalLayanan').value.trim(),
      dokter: document.getElementById('jadwalDokter').value.trim(),
      ruangan: document.getElementById('jadwalRuangan').value.trim(),
      hari: document.getElementById('jadwalHari').value.trim(),
      jam: document.getElementById('jadwalJam').value.trim(),
      status: document.getElementById('jadwalStatus').value
    };

    try {
      submitBtn.disabled = true;
      if (id) {
        await apiRequest(`/api/jadwal/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showAlert('Jadwal layanan berhasil diperbarui.');
      } else {
        await apiRequest('/api/jadwal', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showAlert('Jadwal layanan baru berhasil ditambahkan.');
      }
      resetJadwalForm();
      await loadJadwal();
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById('btnResetJadwal').addEventListener('click', resetJadwalForm);

  tbodyJadwal.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'edit') {
      const item = jadwalList.find((row) => String(row.id) === String(id));
      if (!item) return;
      document.getElementById('jadwalId').value = item.id;
      document.getElementById('jadwalLayanan').value = item.layanan || '';
      document.getElementById('jadwalDokter').value = item.dokter || '';
      document.getElementById('jadwalRuangan').value = item.ruangan || '';
      document.getElementById('jadwalHari').value = item.hari || '';
      document.getElementById('jadwalJam').value = item.jam || '';
      document.getElementById('jadwalStatus').value = item.status || 'Tersedia';

      document.getElementById('jadwalFormTitle').textContent = 'Ubah Jadwal Layanan';
      document.getElementById('btnSubmitJadwal').textContent = 'Perbarui Jadwal';
      formJadwal.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'delete') {
      if (!confirm('Yakin ingin menghapus jadwal layanan ini?')) return;
      try {
        await apiRequest(`/api/jadwal/${id}`, { method: 'DELETE' });
        showAlert('Jadwal layanan berhasil dihapus.');
        await loadJadwal();
      } catch (err) {
        showAlert(err.message, 'error');
      }
    }
  });

  const formBiaya = document.getElementById('formBiaya');
  const tbodyBiaya = document.getElementById('tbodyBiaya');
  const countBiaya = document.getElementById('countBiaya');
  const biayaKategoriSelect = document.getElementById('biayaKategori');
  const biayaHint = document.getElementById('biayaHint');

  function updateBiayaHint() {
    if (biayaKategoriSelect.value === 'Visite & Konsultasi Rawat Inap') {
      biayaHint.textContent = 'Kategori Visite aktif: pastikan mengisi Tarif Umum dan Tarif Cito.';
    } else {
      biayaHint.textContent = 'Pastikan mengisi Tarif Standar (Rp) untuk kategori ini.';
    }
  }

  biayaKategoriSelect.addEventListener('change', updateBiayaHint);

  function resetBiayaForm() {
    formBiaya.reset();
    document.getElementById('biayaId').value = '';
    document.getElementById('biayaFormTitle').textContent = 'Tambah Biaya Layanan';
    document.getElementById('btnSubmitBiaya').textContent = 'Simpan Biaya';
    updateBiayaHint();
  }

  async function loadBiaya() {
    try {
      const res = await apiRequest('/api/biaya');
      biayaList = Array.isArray(res.data) ? res.data : [];
      countBiaya.textContent = biayaList.length;

      if (biayaList.length === 0) {
        tbodyBiaya.innerHTML = '<tr><td colspan="7" class="empty-row">Belum ada data biaya layanan.</td></tr>';
        return;
      }

      tbodyBiaya.innerHTML = biayaList
        .map(
          (item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${escapeHtml(item.kategori)}</td>
              <td><strong>${escapeHtml(item.nama)}</strong></td>
              <td>${formatRupiah(item.tarif)}</td>
              <td>${formatRupiah(item.umum)}</td>
              <td>${formatRupiah(item.cito)}</td>
              <td>
                <div class="action-group">
                  <button type="button" class="btn btn-warning btn-sm" data-action="edit" data-id="${item.id}">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${item.id}">Hapus</button>
                </div>
              </td>
            </tr>
          `
        )
        .join('');
    } catch (err) {
      tbodyBiaya.innerHTML = `<tr><td colspan="7" class="empty-row">${escapeHtml(err.message)}</td></tr>`;
    }
  }

  formBiaya.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('biayaId').value;
    const submitBtn = document.getElementById('btnSubmitBiaya');

    const payload = {
      kategori: biayaKategoriSelect.value,
      nama: document.getElementById('biayaNama').value.trim(),
      tarif: parseNumericInput(document.getElementById('biayaTarif').value),
      umum: parseNumericInput(document.getElementById('biayaUmum').value),
      cito: parseNumericInput(document.getElementById('biayaCito').value)
    };

    try {
      submitBtn.disabled = true;
      if (id) {
        await apiRequest(`/api/biaya/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showAlert('Data biaya layanan berhasil diperbarui.');
      } else {
        await apiRequest('/api/biaya', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showAlert('Data biaya layanan baru berhasil ditambahkan.');
      }
      resetBiayaForm();
      await loadBiaya();
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById('btnResetBiaya').addEventListener('click', resetBiayaForm);

  tbodyBiaya.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'edit') {
      const item = biayaList.find((row) => String(row.id) === String(id));
      if (!item) return;
      document.getElementById('biayaId').value = item.id;
      biayaKategoriSelect.value = item.kategori || 'Pemeriksaan & Konsultasi Rawat Jalan';
      document.getElementById('biayaNama').value = item.nama || '';
      document.getElementById('biayaTarif').value = item.tarif ?? '';
      document.getElementById('biayaUmum').value = item.umum ?? '';
      document.getElementById('biayaCito').value = item.cito ?? '';

      updateBiayaHint();
      document.getElementById('biayaFormTitle').textContent = 'Ubah Biaya Layanan';
      document.getElementById('btnSubmitBiaya').textContent = 'Perbarui Biaya';
      formBiaya.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'delete') {
      if (!confirm('Yakin ingin menghapus item biaya ini?')) return;
      try {
        await apiRequest(`/api/biaya/${id}`, { method: 'DELETE' });
        showAlert('Data biaya layanan berhasil dihapus.');
        await loadBiaya();
      } catch (err) {
        showAlert(err.message, 'error');
      }
    }
  });

  const formPengumuman = document.getElementById('formPengumuman');
  const tbodyPengumuman = document.getElementById('tbodyPengumuman');
  const countPengumuman = document.getElementById('countPengumuman');
  const tanggalInput = document.getElementById('pengumumanTanggal');

  function resetPengumumanForm() {
    formPengumuman.reset();
    document.getElementById('pengumumanId').value = '';
    tanggalInput.value = new Date().toISOString().split('T')[0];
    document.getElementById('pengumumanFormTitle').textContent = 'Tambah Pengumuman';
    document.getElementById('btnSubmitPengumuman').textContent = 'Simpan Pengumuman';
  }

  async function loadPengumuman() {
    try {
      const res = await apiRequest('/api/pengumuman');
      pengumumanList = Array.isArray(res.data) ? res.data : [];
      countPengumuman.textContent = pengumumanList.length;

      if (pengumumanList.length === 0) {
        tbodyPengumuman.innerHTML = '<tr><td colspan="5" class="empty-row">Belum ada data pengumuman.</td></tr>';
        return;
      }

      tbodyPengumuman.innerHTML = pengumumanList
        .map(
          (item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td style="white-space: nowrap;">${formatDateDisplay(item.tanggal)}</td>
              <td><strong>${escapeHtml(item.judul)}</strong></td>
              <td>${escapeHtml(item.isi)}</td>
              <td>
                <div class="action-group">
                  <button type="button" class="btn btn-warning btn-sm" data-action="edit" data-id="${item.id}">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${item.id}">Hapus</button>
                </div>
              </td>
            </tr>
          `
        )
        .join('');
    } catch (err) {
      tbodyPengumuman.innerHTML = `<tr><td colspan="5" class="empty-row">${escapeHtml(err.message)}</td></tr>`;
    }
  }

  formPengumuman.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('pengumumanId').value;
    const submitBtn = document.getElementById('btnSubmitPengumuman');

    const payload = {
      judul: document.getElementById('pengumumanJudul').value.trim(),
      tanggal: tanggalInput.value,
      isi: document.getElementById('pengumumanIsi').value.trim()
    };

    try {
      submitBtn.disabled = true;
      if (id) {
        await apiRequest(`/api/pengumuman/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showAlert('Pengumuman berhasil diperbarui.');
      } else {
        await apiRequest('/api/pengumuman', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showAlert('Pengumuman baru berhasil ditambahkan.');
      }
      resetPengumumanForm();
      await loadPengumuman();
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById('btnResetPengumuman').addEventListener('click', resetPengumumanForm);

  tbodyPengumuman.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'edit') {
      const item = pengumumanList.find((row) => String(row.id) === String(id));
      if (!item) return;
      document.getElementById('pengumumanId').value = item.id;
      document.getElementById('pengumumanJudul').value = item.judul || '';
      tanggalInput.value = formatDateInput(item.tanggal);
      document.getElementById('pengumumanIsi').value = item.isi || '';

      document.getElementById('pengumumanFormTitle').textContent = 'Ubah Pengumuman';
      document.getElementById('btnSubmitPengumuman').textContent = 'Perbarui Pengumuman';
      formPengumuman.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'delete') {
      if (!confirm('Yakin ingin menghapus pengumuman ini?')) return;
      try {
        await apiRequest(`/api/pengumuman/${id}`, { method: 'DELETE' });
        showAlert('Pengumuman berhasil dihapus.');
        await loadPengumuman();
      } catch (err) {
        showAlert(err.message, 'error');
      }
    }
  });

  resetPengumumanForm();
  updateBiayaHint();
  loadCurrentAdmin();
  loadJadwal();
  loadBiaya();
  loadPengumuman();
});