
// Data layanan Puskesmas Sehat
// Data masih hardcode dan nantinya dapat diganti dengan query database.
// Controller dan route tidak perlu diubah.

const daftarProduk = [
  {
    id: 1,
    nama: 'Pemeriksaan Dokter Spesialis',
    kategori: 'Rawat Jalan',
    harga: 90000,
    jadwal: 'Senin - Jumat',
    jam: '08.00 - 12.00 WIB',
  },
  {
    id: 2,
    nama: 'Pemeriksaan Dokter Umum',
    kategori: 'Rawat Jalan',
    harga: 73000,
    jadwal: 'Senin - Jumat',
    jam: '08.00 - 12.00 WIB',
  },
  {
    id: 3,
    nama: 'Pemeriksaan Dokter Gigi',
    kategori: 'Rawat Jalan',
    harga: 75000,
    jadwal: 'Senin - Jumat',
    jam: '08.00 - 12.00 WIB',
  },
  {
    id: 4,
    nama: 'Pemeriksaan Dokter Umum IGD',
    kategori: 'IGD',
    harga: 110000,
    jadwal: 'Sesuai jadwal IGD',
    jam: 'Konfirmasi ke Puskesmas',
  },
  {
    id: 5,
    nama: 'Konsultasi Spesialis IGD',
    kategori: 'IGD',
    harga: 52000,
    jadwal: 'Sesuai jadwal IGD',
    jam: 'Konfirmasi ke Puskesmas',
  },
  {
    id: 6,
    nama: 'Konsultasi Dokter Spesialis',
    kategori: 'Rawat Jalan',
    harga: 90000,
    jadwal: 'Senin - Jumat',
    jam: '08.00 - 12.00 WIB',
  },
  {
    id: 7,
    nama: 'Konsultasi VCT',
    kategori: 'Konsultasi',
    harga: 82000,
    jadwal: 'Sesuai jadwal layanan',
    jam: 'Konfirmasi ke Puskesmas',
  },
  {
    id: 8,
    nama: 'Konseling Narkoba',
    kategori: 'Konsultasi',
    harga: 95000,
    jadwal: 'Sesuai jadwal layanan',
    jam: 'Konfirmasi ke Puskesmas',
  },
  {
    id: 9,
    nama: 'Konsultasi Gizi dengan Komplikasi',
    kategori: 'Layanan Gizi',
    harga: 28000,
    jadwal: 'Sesuai jadwal layanan',
    jam: 'Konfirmasi ke Puskesmas',
  },
  {
    id: 10,
    nama: 'Konsultasi Gizi',
    kategori: 'Layanan Gizi',
    harga: 22000,
    jadwal: 'Sesuai jadwal layanan',
    jam: 'Konfirmasi ke Puskesmas',
  },
  {
    id: 11,
    nama: 'Asesmen Gizi',
    kategori: 'Layanan Gizi',
    harga: 25000,
    jadwal: 'Sesuai jadwal layanan',
    jam: 'Konfirmasi ke Puskesmas',
  },
  {
    id: 12,
    nama: 'Asesmen Keperawatan',
    kategori: 'Keperawatan',
    harga: 25000,
    jadwal: 'Sesuai jadwal layanan',
    jam: 'Konfirmasi ke Puskesmas',
  },
];

const ProdukModel = {
  getAll() {
    return daftarProduk;
  },
};

module.exports = ProdukModel;
