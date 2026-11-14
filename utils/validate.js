//ini rev
//file baru
/**
 * Validasi body berdasarkan daftar field.
 * field: { key, label, type: 'text'|'int'|'date'|'enum', max, options, default, required, check }
 * check(v): fungsi opsional untuk teks, kembalikan pesan error atau null.
 * Kembalian: { errors: [], data: {} }
 */
function validate(body, fields) {
  const src = body && typeof body === 'object' ? body : {};
  const errors = [];
  const data = {};

  for (const f of fields) {
    let v = src[f.key];
    if (typeof v === 'string') v = v.trim();

    const kosong = v === undefined || v === null || v === '';
    if (kosong) {
      const wajib = f.required !== undefined ? f.required : f.default === undefined;
      if (wajib) errors.push(`${f.label} wajib diisi`);
      data[f.key] = f.default !== undefined ? f.default : null;
      continue;
    }

    if (f.type === 'int') {
      const n = Number(v);
      if (typeof v === 'boolean' || !Number.isInteger(n) || n < 0 || n > 2000000000) {
        errors.push(`${f.label} harus bilangan bulat 0 atau lebih`);
      } else {
        data[f.key] = n;
      }
    } else if (f.type === 'enum') {
      if (!f.options.includes(v)) errors.push(`${f.label} tidak valid`);
      else data[f.key] = v;
    } else if (f.type === 'date') {
      if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) {
        errors.push(`${f.label} harus berformat YYYY-MM-DD`);
      } else {
        data[f.key] = v;
      }
    } else {
      if (typeof v !== 'string') {
        errors.push(`${f.label} harus berupa teks`);
      } else if (f.max && v.length > f.max) {
        errors.push(`${f.label} maksimal ${f.max} karakter`);
      } else {
        const salah = f.check ? f.check(v) : null;
        if (salah) errors.push(salah);
        else data[f.key] = v;
      }
    }
  }

  return { errors, data };
}

module.exports = validate;