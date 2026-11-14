CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  -- ini rev yg pass dan create
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jadwal (
  id           SERIAL PRIMARY KEY,
  layanan      VARCHAR(100) NOT NULL,
  dokter       VARCHAR(100) NOT NULL,
  ruangan      VARCHAR(100) NOT NULL,
  hari         VARCHAR(50) NOT NULL,  -- Sudah 50 agar aman
  jam          VARCHAR(50) NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'Tersedia'
    CHECK (status IN ('Tersedia', 'Penuh', 'Libur')),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ini rev tambahan
CREATE TABLE IF NOT EXISTS biaya (
    id SERIAL PRIMARY KEY,
    kategori VARCHAR(100) NOT NULL,
    nama VARCHAR(150) NOT NULL,
    tarif INTEGER NOT NULL CHECK (tarif >= 0),
    umum INTEGER CHECK (umum >= 0),
    cito INTEGER CHECK (cito >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pengumuman (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(150) NOT NULL,
    tanggal DATE NOT NULL,
    isi TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Jika dijalankan di DB kosong, admin dibuat.
-- Jika dijalankan berkali-kali, tidak akan error duplicate.
INSERT INTO admins (username, password_hash)
VALUES (
  'admin',
  '$2b$10$v7otfWeItzbnYf2AK5UhRef6GtQwypPakr/I2M8Shco7etvCpaxFi'
)
ON CONFLICT (username) DO NOTHING;