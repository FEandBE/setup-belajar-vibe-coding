# Belajar Vibe Coding - Backend API

Aplikasi ini adalah sistem backend RESTful API untuk fitur Autentikasi Pengguna (User Authentication). Proyek ini dibangun dengan fokus pada performa yang sangat cepat dan *Developer Experience* (DX) yang modern, menggunakan ekosistem **Bun**.

Fitur utama meliputi: Pendaftaran pengguna (Register), Masuk (Login) berbasis sesi (Session Token), Pengambilan data profil, dan Keluar (Logout).

---

## 🛠️ Technology Stack & Libraries

Proyek ini dibangun menggunakan teknologi mutakhir berikut:

### Core Stack
- **[Bun](https://bun.sh/)**: Runtime JavaScript/TypeScript super cepat *all-in-one* (Runtime, Package Manager, Bundler, dan Test Runner).
- **[ElysiaJS](https://elysiajs.com/)**: Framework web ergonomis dan sangat cepat untuk Bun.
- **[SQLite](https://sqlite.org/)**: Database relasional ringan (menggunakan driver bawaan `bun:sqlite`).
- **[Drizzle ORM](https://orm.drizzle.team/)**: TypeScript ORM yang *type-safe* dan intuitif.

### Libraries Utama
- `elysia`: Foundation web framework.
- `drizzle-orm` & `drizzle-kit`: ORM layer dan alat manajemen skema database.
- `bcryptjs`: Digunakan untuk melakukan *hashing* pada password pengguna yang disimpan di database.

---

## 📁 Arsitektur & Struktur Direktori

Aplikasi ini mengadopsi pola **Service-Route Architecture** untuk memisahkan antara logika pengalihan URL (Routing) dengan logika bisnis utama.

Seluruh file penamaan menggunakan huruf kecil yang dipisahkan oleh tanda hubung (*Kebab-case*, contoh: `user-routes.ts`).

```text
belajar-vibe-coding/
├── src/                    # Direktori utama kode sumber (Source Code)
│   ├── index.ts            # Entry point aplikasi & Inisialisasi Server Elysia
│   ├── routes/             # Layer presentasi / endpoint (Mengatur request & response)
│   │   └── user-routes.ts  # Endpoint untuk modul User
│   ├── services/           # Layer logika bisnis & interaksi langsung dengan database (ORM)
│   │   └── user-services.ts# Logika daftar, login, dll.
│   └── db/                 # Konfigurasi Database
│       ├── index.ts        # Koneksi database SQLite
│       └── schema.ts       # Definisi struktur/tabel database Drizzle
├── test/                   # Direktori untuk file unit testing
│   └── user.test.ts        # File pengujian untuk semua API User
├── sqlite.db               # File lokal database SQLite
├── drizzle.config.ts       # Konfigurasi migrasi Drizzle ORM
└── package.json            # Daftar dependensi & scripts
```

---

## 🗄️ Database Schema

Sistem ini didukung oleh dua tabel utama yang didefinisikan menggunakan Drizzle ORM.

1. **`users` Table**
   - `id` (Integer, Primary Key, Auto Increment)
   - `username` (Text, Not Null) - Nama pengguna.
   - `email` (Text, Unique, Not Null) - Alamat surel.
   - `password` (Text, Not Null) - Kata sandi yang sudah di-*hash* via bcrypt.
   - `createdAt` (Text, Not Null) - Timestamp bawaan.
   - `updatedAt` (Text, Not Null) - Timestamp saat *update*.

2. **`sessions` Table**
   - `id` (Integer, Primary Key, Auto Increment)
   - `token` (Text, Unique, Not Null) - UUID acak sebagai ID sesi akses.
   - `userId` (Integer, Not Null) - *Foreign Key* merujuk pada tabel `users.id`.
   - `createdAt` (Text, Not Null) - Timestamp bawaan.

---

## 📡 Available APIs

### 1. Register User
- **Endpoint**: `POST /api/users`
- **Body**:
  ```json
  {
    "nama": "Budi", // 3 - 100 Karakter
    "email": "budi@example.com", // Format Email Valid, Max 150 Karakter
    "password": "password123" // 6 - 255 Karakter
  }
  ```
- **Response (200 OK)**: `{"data": "ok"}`

### 2. Login User
- **Endpoint**: `POST /api/users/login`
- **Body**:
  ```json
  {
    "email": "budi@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "data": "550e8400-e29b-41d4-a716-446655440000" // Session Token UUID
  }
  ```

### 3. Get Current User Profile
- **Endpoint**: `GET /api/users/current`
- **Headers**:
  - `Authorization`: `Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "data": {
      "id": 1,
      "nama": "Budi",
      "email": "budi@example.com",
      "created_at": "CURRENT_TIMESTAMP"
    }
  }
  ```

### 4. Logout User
- **Endpoint**: `DELETE /api/users/logout`
- **Headers**:
  - `Authorization`: `Bearer <token>`
- **Response (200 OK)**: `{"data": "ok"}` (Session token akan dihapus dari tabel sessions).

> *Semua kegagalan API akan mengembalikan status `400 Bad Request`, `401 Unauthorized`, atau pesan error kustom dalam struktur `{ "data": "Pesan Error" }`*.

---

## 🚀 Cara Setup & Run Project

1. **Install Dependencies**
   Pastikan Anda sudah menginstal [Bun](https://bun.sh/) di komputer lokal Anda, kemudian jalankan:
   ```bash
   bun install
   ```

2. **Setup Database (Sinkronisasi ORM)**
   Proyek ini menggunakan SQLite, sehingga tidak perlu menginstall MariaDB/MySQL. Anda hanya perlu mensinkronisasi skema ke dalam file `sqlite.db`:
   ```bash
   bun run db:push
   ```

3. **Menjalankan Server (Development)**
   Gunakan mode *watch* agar server melakukan memuat ulang (*hot-reload*) otomatis jika terjadi perubahan kode sumber:
   ```bash
   bun run dev
   ```
   *Aplikasi akan berjalan secara lokal pada alamat `http://localhost:3000`.*

---

## 🧪 Cara Test Aplikasi

Proyek ini dilengkapi dengan serangkaian pengujian terotomatisasi (*Unit Testing*) menggunakan *Test Runner* gahar dari Bun yang terintegrasi secara bawaan. Semua pengujian akan membersihkan database sebelum bekerja (`beforeEach`).

Untuk menjalankan seluruh rangkaian tes:
```bash
bun test
```
*(Seluruh skenario pengujian akan tervalidasi dan menampilkan laporan secara instan di terminal).*
