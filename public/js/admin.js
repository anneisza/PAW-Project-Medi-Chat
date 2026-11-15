//ini rev
const $ = (id) => document.getElementById(id);
const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);

const RJ = 'Pemeriksaan & Konsultasi Rawat Jalan';
const VISITE = 'Visite & Konsultasi Rawat Inap';
const AKOMODASI = 'Akomodasi Rawat Inap';
const KATEGORI = [RJ, VISITE, AKOMODASI];
const STATUS = ['Tersedia', 'Penuh', 'Libur'];

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Senin - Sabtu', 'Senin - Jumat', 'Senin - Kamis'];

// Daftar Tindakan sesuai Kategori
const TINDAKAN = {
  [RJ]: [
    'Pemeriksaan Dokter Spesialis',
    'Pemeriksaan Dokter Umum',
    'Pemeriksaan Dokter Gigi',
    'Konsultasi Gizi',
    'Asesmen Keperawatan',
    'Tindakan Medis Ringan'
  ],
  [VISITE]: [
    'Kelas I', 'Kelas II', 'Kelas III', 'VIP', 'ICU/NICU', 'Isolasi / Intermediet'
  ],
  [AKOMODASI]: [
    'Kelas I', 'Kelas II', 'Kelas III', 'VIP', 'ICU/NICU', 'One Day Care'
  ]
};

const rupiah = (n) =>
  n === null || n === undefined || n === ''
    ? ''
    : new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(n);

const config = {
  jadwal: {
    api: '/api/jadwal',
    judul: 'Jadwal Layanan',
    desk: 'Kelola jadwal dokter umum, dokter gigi, dan imunisasi.',
    fields: [
      { key: 'layanan', label: 'Layanan', type: 'text', placeholder: 'Contoh: Dokter Umum', max: 100 },
      { key: 'dokter', label: 'Nama Dokter', type: 'text', placeholder: 'Contoh: dr. Andi Pratama', max: 100 },
      { key: 'ruangan', label: 'Ruangan', type: 'text', placeholder: 'Contoh: Poli Umum', max: 100 },
      { key: 'hari', label: 'Hari', type: 'select', options: HARI },
      { key: 'jam', label: 'Jam', type: 'text', placeholder: 'Contoh: 08.00 - 12.00', max: 50 },
      { key: 'status', label: 'Status', type: 'select', options: STATUS },
    ],
  },
  biaya: {
    api: '/api/biaya',
    judul: 'Biaya Pengobatan',
    desk: 'Kelola tarif rawat jalan dan rawat inap.',
    fields: [
      { key: 'kategori', label: 'Kategori', type: 'select', options: KATEGORI },
      { key: 'nama', label: 'Tindakan / Kelas', type: 'dynamic-select', options: TINDAKAN },
      { key: 'tarif', label: 'Tarif (Visite: dr. Spesialis)', type: 'number', rupiah: true },
      { key: 'umum', label: 'Tarif dr. Umum', type: 'number', rupiah: true, only: VISITE },
      { key: 'cito', label: 'Cito/Libur dr. Spesialis', type: 'number', rupiah: true, only: VISITE },
    ],
  },
  pengumuman: {
    api: '/api/pengumuman',
    judul: 'Informasi Puskesmas',
    desk: 'Kelola info terbaru Puskesmas.',
    fields: [
      { key: 'judul', label: 'Judul', type: 'text', placeholder: 'Contoh: Imunisasi Anak', max: 150 },
      { key: 'tanggal', label: 'Tanggal', type: 'date' },
      { key: 'isi', label: 'Isi Pengumuman', type: 'textarea', placeholder: 'Tulis detail informasi...' },
    ],
  },
};

const data = { jadwal: [], biaya: [], pengumuman: [] };
let tab = 'jadwal';
let editId = null;

// ---------- API ----------
async function api(method, url, body) {
  const opsi = { method, headers: {} };
  if (body !== undefined) {
    opsi.headers['Content-Type'] = 'application/json';
    opsi.body = JSON.stringify(body);
  }

  const res = await fetch(url, opsi);
  let hasil = {};
  try {
    hasil = await res.json();
  } catch (_) {
    /* respons bukan JSON */
  }

  if (res.status === 401) {
    location.href = '/admin/login'; // sesi habis
    throw new Error('Sesi habis, silakan login lagi');
  }
  if (!res.ok || !hasil.success) {
    throw new Error(hasil.message || 'Terjadi kesalahan pada server');
  }
  return hasil.data;
}

async function muat(kunci) {
  data[kunci] = (await api('GET', config[kunci].api)) || [];
}

const muatSemua = () => Promise.all(Object.keys(config).map(muat));

// ---------- Tampilan ----------
function render() {
  const c = config[tab];
  $('judul').textContent = c.judul;
  $('deskripsi').textContent = c.desk;

  // Kartu statistik
  const stats = $('stats');
  stats.replaceChildren();
  Object.keys(config).forEach((k) => {
    const card = el('div', { className: 'stat' + (k === tab ? ' aktif' : '') });
    card.append(
      el('span', { className: 'stat-angka', textContent: data[k].length }),
      el('span', { className: 'stat-label', textContent: config[k].judul })
    );
    stats.append(card);
  });

  // Header tabel
  const trh = el('tr');
  c.fields.forEach((f) => trh.append(el('th', { textContent: f.label })));
  trh.append(el('th', { textContent: 'Aksi' }));
  $('thead').replaceChildren(trh);

  // Isi tabel
  const rows = data[tab].map((item) => {
    const tr = el('tr');
    c.fields.forEach((f) => {
      const mentah = item[f.key];
      const val = f.rupiah ? rupiah(mentah) : mentah ?? '';
      const td = el('td', { textContent: val || '-' });
      if (!val) td.classList.add('kosong');
      td.dataset.label = f.label; // dipakai CSS saat tabel jadi kartu di mobile
      tr.append(td);
    });

    const aksi = el('td', { className: 'aksi' });
    const ubah = el('button', { type: 'button', className: 'btn-sm ubah', textContent: 'Ubah' });
    const hapus = el('button', { type: 'button', className: 'btn-sm hapus', textContent: 'Hapus' });
    ubah.addEventListener('click', () => bukaForm(item.id));
    hapus.addEventListener('click', () => hapusData(item.id));
    aksi.append(ubah, hapus);

    tr.append(aksi);
    return tr;
  });

  $('tbody').replaceChildren(...rows);
  $('empty').hidden = rows.length > 0;
}

// ---------- Form tambah / ubah ----------
function bukaForm(id = null) {
  editId = id;
  const c = config[tab];
  const item = id ? data[tab].find((d) => d.id === id) || {} : {};

  $('dlg-title').textContent = (id ? 'Ubah ' : 'Tambah ') + c.judul;
  $('form-error').hidden = true;

  const wrap = $('fields');
  wrap.replaceChildren();

  c.fields.forEach((f) => {
    const box = el('div', { className: 'field' });
    const lab = el('label', { htmlFor: 'f-' + f.key, textContent: f.label });

    let input;
    if (f.type === 'select') {
      input = el('select');
      f.options.forEach((o) => input.append(new Option(o, o)));
    } else if (f.type === 'dynamic-select') {
      input = el('select');
      const katTerpilih = $('f-kategori') ? $('f-kategori').value : KATEGORI[0];
      const opsiTindakan = f.options[katTerpilih] || [];
      opsiTindakan.forEach((o) => input.append(new Option(o, o)));
    } else if (f.type === 'textarea') {
      input = el('textarea', { rows: 3 });
      if (f.placeholder) input.placeholder = f.placeholder;
    } else if (f.type === 'number') {
      input = el('input', { type: 'number', min: 0, step: 1 });
    } else if (f.type === 'date') {
      // Validasi Tanggal: Min hari ini, Max 6 bulan ke depan
      input = el('input', { type: 'date' });
      const hariIni = new Date();
      const formatHariIni = hariIni.toISOString().split('T')[0];
      
      const enamBulanKemudian = new Date();
      enamBulanKemudian.setMonth(enamBulanKemudian.getMonth() + 6);
      const formatMaksimal = enamBulanKemudian.toISOString().split('T')[0];

      input.min = formatHariIni;
      input.max = formatMaksimal;
      
      if (!item[f.key]) {
          input.value = formatHariIni; // Default isi dengan hari ini
      }
    } else {
      input = el('input', { type: f.type });
      if (f.placeholder) input.placeholder = f.placeholder;
      if (f.max) input.maxLength = f.max;
    }

    input.id = 'f-' + f.key;
    input.required = true;
    if (item[f.key] !== undefined && item[f.key] !== null) input.value = item[f.key];

    box.append(lab, input);
    wrap.append(box);
  });

  // Kolom Visite (dr. Umum, Cito) hanya muncul kalau kategori = Visite
  const kat = $('f-kategori');
  const atur = () =>
    c.fields.forEach((f) => {
      if (!f.only) return;
      const tampil = kat.value === f.only;
      const n = $('f-' + f.key);
      n.closest('.field').style.display = tampil ? '' : 'none';
      n.required = tampil;
    });
    
  if (kat) {
    kat.addEventListener('change', atur);
    atur();
    
    if (tab === 'biaya') {
      kat.addEventListener('change', () => {
        const selectTindakan = $('f-nama');
        selectTindakan.innerHTML = ''; 
        const opsiBaru = TINDAKAN[kat.value] || [];
        opsiBaru.forEach((o) => selectTindakan.append(new Option(o, o)));
      });
    }
  }

  $('dlg').showModal();
}

async function hapusData(id) {
  if (!confirm('Hapus data ini?')) return;
  try {
    await api('DELETE', `${config[tab].api}/${id}`);
    await muat(tab);
    render();
  } catch (err) {
    alert(err.message);
  }
}

// ---------- Event ----------
document.querySelectorAll('.tab').forEach((b) => {
  b.addEventListener('click', () => {
    tab = b.dataset.tab;
    document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === b));
    render();
  });
});

$('btn-tambah').addEventListener('click', () => bukaForm());
$('batal').addEventListener('click', () => $('dlg').close());

$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const c = config[tab];

  const baru = {};
  c.fields.forEach((f) => {
    const n = $('f-' + f.key);
    baru[f.key] = n.closest('.field').style.display === 'none' ? '' : n.value.trim();
  });

  $('simpan').disabled = true;
  $('form-error').hidden = true;

  try {
    if (editId) await api('PUT', `${c.api}/${editId}`, baru);
    else await api('POST', c.api, baru);

    await muat(tab);
    render();
    $('dlg').close();
  } catch (err) {
    $('form-error').textContent = err.message;
    $('form-error').hidden = false;
  } finally {
    $('simpan').disabled = false;
  }
});

// Keluar (sidebar desktop dan top bar mobile)
document.querySelectorAll('.js-logout').forEach((b) => {
  b.addEventListener('click', async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      location.href = '/admin/login';
    }
  });
});

muatSemua()
  .then(render)
  .catch((err) => {
    render();
    $('empty').textContent = err.message;
    $('empty').hidden = false;
  });