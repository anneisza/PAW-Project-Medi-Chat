CREATE TABLE IF NOT EXISTS produk (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    harga INTEGER NOT NULL CHECK (harga >= 0),
    jadwal VARCHAR(150) NOT NULL,
    jam VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO produk (nama, kategori, harga, jadwal, jam)
SELECT v.nama,
    v.kategori,
    v.harga,
    v.jadwal,
    v.jam
FROM (
        VALUES (
                'Pemeriksaan Dokter Spesialis',
                'Rawat Jalan',
                90000,
                'Senin - Jumat',
                '08.00 - 12.00 WIB'
            ),
            (
                'Pemeriksaan Dokter Umum',
                'Rawat Jalan',
                73000,
                'Senin - Jumat',
                '08.00 - 12.00 WIB'
            ),
            (
                'Pemeriksaan Dokter Gigi',
                'Rawat Jalan',
                75000,
                'Senin - Jumat',
                '08.00 - 12.00 WIB'
            ),
            (
                'Pemeriksaan Dokter Umum IGD',
                'IGD',
                110000,
                'Sesuai jadwal IGD',
                'Konfirmasi ke Puskesmas'
            ),
            (
                'Konsultasi Spesialis IGD',
                'IGD',
                52000,
                'Sesuai jadwal IGD',
                'Konfirmasi ke Puskesmas'
            ),
            (
                'Konsultasi Dokter Spesialis',
                'Rawat Jalan',
                90000,
                'Senin - Jumat',
                '08.00 - 12.00 WIB'
            ),
            (
                'Konsultasi VCT',
                'Konsultasi',
                82000,
                'Sesuai jadwal layanan',
                'Konfirmasi ke Puskesmas'
            ),
            (
                'Konseling Narkoba',
                'Konsultasi',
                95000,
                'Sesuai jadwal layanan',
                'Konfirmasi ke Puskesmas'
            ),
            (
                'Konsultasi Gizi',
                'Layanan Gizi',
                22000,
                'Sesuai jadwal layanan',
                'Konfirmasi ke Puskesmas'
            ),
            (
                'Asesmen Keperawatan',
                'Keperawatan',
                25000,
                'Sesuai jadwal layanan',
                'Konfirmasi ke Puskesmas'
            )
    ) AS v(nama, kategori, harga, jadwal, jam)
WHERE NOT EXISTS (
        SELECT 1
        FROM produk
    );