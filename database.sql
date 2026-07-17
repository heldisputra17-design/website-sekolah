CREATE DATABASE IF NOT EXISTS sdn004;
USE sdn004;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(100),
  role ENUM('admin','operator') DEFAULT 'operator',
  foto VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password, nama_lengkap, role) VALUES
('admin', 'admin@sdn004.sch.id', '$2a$10$dummyhash', 'Administrator', 'admin');

CREATE TABLE kategori_berita (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO kategori_berita (nama, slug) VALUES
('Akademik', 'akademik'),
('Kegiatan', 'kegiatan'),
('Pengumuman', 'pengumuman');

CREATE TABLE berita (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  konten TEXT,
  thumbnail VARCHAR(255),
  kategori_id INT,
  penulis VARCHAR(100),
  status ENUM('draft','publish') DEFAULT 'draft',
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES kategori_berita(id) ON DELETE SET NULL
);

CREATE TABLE guru (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  nip VARCHAR(30),
  jabatan VARCHAR(100),
  mapel VARCHAR(100),
  foto VARCHAR(255),
  pendidikan VARCHAR(100),
  status_kepegawaian ENUM('PNS','PPPK','Honorer') DEFAULT 'Honorer',
  tampil_di_website TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prestasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  kategori ENUM('Akademik','Non-Akademik') DEFAULT 'Akademik',
  prestasi VARCHAR(100),
  foto VARCHAR(255),
  tanggal DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE album (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  cover VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE foto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id INT NOT NULL,
  file VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE CASCADE
);

CREATE TABLE video (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  thumbnail VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agenda (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  waktu TIME,
  lokasi VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profil_sekolah (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jenis ENUM('sejarah','visi','misi','sambutan') NOT NULL UNIQUE,
  konten TEXT,
  foto VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO profil_sekolah (jenis, konten) VALUES
('sejarah', 'Sejarah SD Negeri 004 Tenggarong'),
('visi', 'Visi SD Negeri 004 Tenggarong'),
('misi', 'Misi SD Negeri 004 Tenggarong'),
('sambutan', 'Sambutan Kepala SD Negeri 004 Tenggarong');

CREATE TABLE struktur_organisasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  foto VARCHAR(255),
  parent_id INT DEFAULT NULL,
  urutan INT DEFAULT 0,
  FOREIGN KEY (parent_id) REFERENCES struktur_organisasi(id) ON DELETE SET NULL
);

CREATE TABLE fasilitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  foto VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ppdb (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  konten TEXT,
  jenis ENUM('informasi','persyaratan','jadwal') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ppdb_file (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ppdb_id INT,
  nama_file VARCHAR(255),
  file VARCHAR(255),
  FOREIGN KEY (ppdb_id) REFERENCES ppdb(id) ON DELETE CASCADE
);

CREATE TABLE kontak (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alamat TEXT,
  nomor_telepon VARCHAR(30),
  email VARCHAR(100),
  whatsapp VARCHAR(30),
  google_maps TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO kontak (alamat, nomor_telepon, email, whatsapp) VALUES
('Jl. Contoh No. 123, Tenggarong', '0541-123456', 'info@sdn004.sch.id', '08123456789');

CREATE TABLE statistik (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  nilai INT DEFAULT 0,
  icon VARCHAR(50)
);

INSERT INTO statistik (label, nilai, icon) VALUES
('Siswa', 500, 'fas fa-users'),
('Guru', 30, 'fas fa-chalkboard-teacher'),
('Kelas', 18, 'fas fa-door-open'),
('Prestasi', 50, 'fas fa-trophy');
