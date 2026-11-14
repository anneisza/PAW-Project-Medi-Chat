//ini rev
//file baru
const sendResponse = require('./response');
const validate = require('./validate');

const idValid = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

function makeController({ model, label, fields, prepare = (d) => d }) {
  const cek = (body) =>
    validate(body, typeof fields === 'function' ? fields(body || {}) : fields);

  const salahId = (res) =>
    sendResponse(res, { code: 400, success: false, message: 'ID tidak valid' });
  const tidakAda = (res) =>
    sendResponse(res, { code: 404, success: false, message: `Data ${label} tidak ditemukan` });
  const gagalValidasi = (res, errors) =>
    sendResponse(res, {
      code: 400,
      success: false,
      message: errors.join('; '),
      data: { errors },
    });

  return {
    async getAll(req, res, next) {
      try {
        const data = await model.getAll();
        sendResponse(res, { message: `Berhasil mengambil data ${label}`, data });
      } catch (e) {
        next(e);
      }
    },

    async getById(req, res, next) {
      try {
        if (!idValid(req.params.id)) return salahId(res);
        const data = await model.getById(req.params.id);
        if (!data) return tidakAda(res);
        sendResponse(res, { message: `Berhasil mengambil data ${label}`, data });
      } catch (e) {
        next(e);
      }
    },

    async create(req, res, next) {
      try {
        const { errors, data } = cek(req.body);
        if (errors.length) return gagalValidasi(res, errors);
        const baru = await model.create(prepare(data));
        sendResponse(res, { code: 201, message: `Data ${label} berhasil ditambahkan`, data: baru });
      } catch (e) {
        next(e);
      }
    },

    async update(req, res, next) {
      try {
        if (!idValid(req.params.id)) return salahId(res);
        const { errors, data } = cek(req.body);
        if (errors.length) return gagalValidasi(res, errors);
        const hasil = await model.update(req.params.id, prepare(data));
        if (!hasil) return tidakAda(res);
        sendResponse(res, { message: `Data ${label} berhasil diperbarui`, data: hasil });
      } catch (e) {
        next(e);
      }
    },

    async remove(req, res, next) {
      try {
        if (!idValid(req.params.id)) return salahId(res);
        const hasil = await model.remove(req.params.id);
        if (!hasil) return tidakAda(res);
        sendResponse(res, { message: `Data ${label} berhasil dihapus`, data: hasil });
      } catch (e) {
        next(e);
      }
    },
  };
}

module.exports = makeController;