# SIMRS – Sistem Informasi Manajemen Rumah Sakit

## 1. Deskripsi Project

SIMRS merupakan aplikasi simulasi Sistem Informasi Manajemen Rumah Sakit yang dikembangkan untuk mendukung proses pengelolaan data dan pelayanan pasien di rumah sakit.

Project ini dikembangkan menggunakan arsitektur REST API dengan pemisahan antara backend dan frontend.

## 2. Teknologi yang Digunakan

### Backend
- PHP
- Yii2 Framework
- PostgreSQL
- REST API

### Frontend
- React.js
- CoreUI
- React Router
- JavaScript
- Axios

### Database
- PostgreSQL
- Relational Database
- Database Migration Yii2

## 3. Modul yang Telah Dikerjakan

### Master Data
- Master Pasien
- Master Ruangan
- Master Dokter
- Master Jadwal Dokter
- Master Tindakan
- Master Obat

### Modul Registrasi Pasien dan Antrean

Modul registrasi merupakan bagian utama yang telah dikerjakan dalam project ini.

Fitur yang tersedia atau telah diimplementasikan:

- Menampilkan daftar registrasi pasien.
- Pencarian registrasi berdasarkan nomor registrasi dan identitas pasien.
- Filter data berdasarkan rentang tanggal kunjungan.
- Filter berdasarkan ruangan.
- Filter berdasarkan dokter.
- Filter berdasarkan status pendaftaran.
- Membuat registrasi pasien.
- Mengubah data registrasi pasien.
- Membuat nomor registrasi secara otomatis.
- Membuat nomor antrean secara otomatis berdasarkan tanggal dan ruangan.
- Validasi jadwal dokter.
- Validasi kuota jadwal dokter.
- Validasi agar pasien tidak memiliki pendaftaran aktif ganda pada tanggal yang sama.
- Membatalkan pendaftaran dengan alasan pembatalan.
- Menyimpan riwayat aktivitas pendaftaran pasien.

## 4. Database

Database menggunakan PostgreSQL dengan struktur relasional.

Tabel utama yang digunakan dalam proses registrasi:

| Tabel | Keterangan |
|---|---|
| pasien | Menyimpan data identitas pasien |
| ruangan | Menyimpan data ruangan/poliklinik |
| dokter | Menyimpan data dokter |
| jadwal_dokter | Menyimpan jadwal praktik dokter |
| pendaftaran | Menyimpan data registrasi pasien |
| antrean | Menyimpan nomor dan status antrean |
| riwayat_kunjungan | Menyimpan riwayat aktivitas pendaftaran |

Relasi antartabel menggunakan foreign key untuk menjaga integritas data.

## 5. Alur Registrasi Pasien

1. Petugas memilih atau mencari pasien.
2. Petugas menentukan tanggal kunjungan.
3. Sistem menampilkan pilihan ruangan dan dokter berdasarkan jadwal yang tersedia.
4. Sistem melakukan validasi jadwal dan kuota dokter.
5. Sistem memeriksa apakah pasien sudah memiliki pendaftaran aktif pada tanggal tersebut.
6. Sistem membuat nomor registrasi secara otomatis.
7. Sistem membuat nomor antrean berdasarkan ruangan dan tanggal kunjungan.
8. Data pendaftaran, antrean, dan riwayat aktivitas disimpan dalam satu transaksi database.

## 6. Validasi dan Konsistensi Data

Beberapa mekanisme validasi yang diterapkan:

- Validasi field wajib.
- Validasi format tanggal.
- Validasi keberadaan pasien.
- Validasi status aktif ruangan.
- Validasi kesesuaian dokter, ruangan, dan jadwal praktik.
- Validasi kuota jadwal dokter.
- Pencegahan pendaftaran aktif ganda.
- Penggunaan database transaction untuk menjaga konsistensi penyimpanan data.
- Penggunaan database locking pada proses tertentu untuk mengurangi risiko duplikasi nomor antrean.

## 7. API Registrasi

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/pendaftaran` | Mengambil daftar registrasi |
| POST | `/api/pendaftaran` | Membuat registrasi |
| GET | `/api/pendaftaran/{id}` | Mengambil detail registrasi |
| PUT | `/api/pendaftaran/{id}` | Mengubah registrasi |
| POST | `/api/pendaftaran/{id}/batal` | Membatalkan registrasi |

### Contoh Request Pendaftaran

```json
{
  "pasien_id": 1,
  "ruangan_id": 1,
  "dokter_id": 1,
  "jadwal_dokter_id": 1,
  "tanggal_kunjungan": "2026-11-26",
  "jenis_kunjungan": "BARU",
  "jenis_pembayaran": "UMUM",
  "keluhan": "Demam dan batuk"
}
```

## 8. Struktur Project

Secara umum project terdiri dari dua bagian:

```text
rs_simulasi/
├── backend-yii/
│   ├── app/
│   │   ├── controllers/
│   │   │   └── api/
│   │   ├── models/
│   │   └── ...
│   ├── migrations/
│   └── ...
│
└── frontend-react/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── services/
    │   ├── views/
    │   └── ...
    └── ...
```

*Catatan: Struktur folder dapat disesuaikan dengan struktur aktual repository.*

## 9. Instalasi dan Menjalankan Project

### Backend

Masuk ke direktori backend:

```bash
cd backend-yii
```

Install dependency:

```bash
composer install
```

Sesuaikan konfigurasi database PostgreSQL pada konfigurasi Yii2.

Jalankan migration:

```bash
php yii migrate
```

Jalankan server development:

```bash
php yii serve --port=8080
```

Backend API dapat diakses melalui:

```text
http://localhost:8080
```

### Frontend

Masuk ke direktori frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Jalankan aplikasi:

```bash
npm run dev
```

Sesuaikan konfigurasi base URL API frontend dengan alamat backend.

## 10. Batasan Pengerjaan

Pengembangan project difokuskan pada master data dan proses registrasi pasien beserta antrean.

Karena keterbatasan waktu pengerjaan, pengembangan belum mencakup keseluruhan modul SIMRS, seperti:

- Rawat Jalan.
- Rawat Inap.
- Rekam Medis Elektronik.
- Pelayanan Farmasi.
- Laboratorium.
- Radiologi.
- Billing dan Pembayaran.
- Pelaporan Manajemen.

Modul-modul tersebut belum diimplementasikan secara menyeluruh dan masih dapat dikembangkan pada tahap berikutnya.

## 11. Pengembangan Selanjutnya

Beberapa pengembangan yang dapat dilakukan:

- Melanjutkan integrasi proses registrasi dengan pelayanan rawat jalan.
- Mengembangkan modul rekam medis elektronik.
- Mengembangkan pengelolaan antrean dan pemanggilan pasien.
- Mengembangkan modul farmasi, laboratorium, dan radiologi.
- Menambahkan pengujian otomatis pada backend dan frontend.
- Menambahkan dokumentasi API menggunakan Swagger/OpenAPI.

---

**Status Project:** Pengembangan parsial – Master Data dan Registrasi Pasien.

Project ini merupakan implementasi simulasi SIMRS dan masih terbuka untuk pengembangan lebih lanjut.