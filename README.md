# Belajar Vibe Coding 🦊💜

Proyek Fullstack modern bertema "Vibe Coding" yang mengintegrasikan Backend (Bun + ElysiaJS) dengan Frontend (React + Vite). Proyek ini dirancang sebagai taman bermain (*playground*) untuk mengeksplorasi teknologi web terbaru dengan desain premium.

## 🚀 Fitur Utama

### 🛠️ Backend (The Core)
- **User Management**: Registrasi, Login/Logout, dan Session Management menggunakan token database.
- **Relational Todo System**: Implementasi CRUD Todo yang terikat secara relasional (One-to-Many) dengan user yang login.
- **Drizzle ORM**: Manajemen skema database yang *type-safe* untuk MySQL.
- **Swagger Documentation**: Dokumentasi API interaktif otomatis di `/swagger`.
- **CORS Enabled**: Siap untuk dikonsumsi oleh aplikasi frontend lintas-asal.

### 🎨 Frontend (The UI)
- **Premium Purple & Black Theme**: Desain futuristik dengan palet warna ungu elektrik dan hitam pekat.
- **Glassmorphism Design**: Antarmuka transparan dengan efek *blur* dan *glow background*.
- **Responsive Layout**: Navigasi premium dan dashboard yang adaptif.
- **Smooth Animations**: Integrasi Framer Motion untuk transisi elemen yang elegan.
- **Modern Stack**: Dibangun dengan Vite, React, TypeScript, dan Lucide Icons.

---

## 🏗️ Struktur Proyek

```text
.
├── frontend/             # Root aplikasi Frontend (Vite + React)
│   ├── src/
│   │   ├── components/   # Komponen UI (Navbar, Cards, dll)
│   │   ├── App.tsx       # Routing & Layout Utama (Purple & Black Theme)
│   │   └── index.css     # Sistem Desain Premium
│   └── vite.config.ts    # Setup Proxy ke Backend
├── src/                  # Root aplikasi Backend (ElysiaJS)
│   ├── db/               # Skema & Koneksi Database (Drizzle)
│   ├── routes/           # Endpoint API (Users & Todos)
│   ├── services/         # Logika Bisnis (CRUD Logic)
│   └── index.ts          # Entry Point & Konfigurasi Server
├── drizzle.config.ts     # Konfigurasi Drizzle ORM
└── package.json          # Root dependencies (Bun)
```

---

## ⚙️ Cara Setup & Menjalankan

### 1. Prasyarat
- [Bun](https://bun.sh/) terinstal di komputer Anda.
- MySQL Server aktif (misal via XAMPP).

### 2. Instalasi
Clone repository dan instal dependensi di root serta folder frontend:
```bash
# Instal dependensi backend
bun install

# Instal dependensi frontend
cd frontend
bun install
cd ..
```

### 3. Konfigurasi Database
Buat file `.env` di root proyek:
```env
DATABASE_URL=mysql://root:@localhost:3306/belajar_vibe_coding
```
Sinkronisasi database:
```bash
bunx drizzle-kit push
```

### 4. Menjalankan Aplikasi
Buka dua terminal:

**Terminal 1 (Backend - Port 3000)**
```bash
bun run dev
```

**Terminal 2 (Frontend - Port 5173)**
```bash
cd frontend
bun run dev -- --bun
```
*Catatan: Gunakan flag `--bun` untuk memastikan kompatibilitas `crypto` di lingkungan Node lama.*

---

## 🧪 API Endpoints

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/users` | `POST` | Registrasi user baru |
| `/api/users/login` | `POST` | Login user & dapatkan token |
| `/api/todos` | `GET` | Ambil semua todo milik user (Bearer Auth) |
| `/api/todos` | `POST` | Buat todo baru |
| `/api/todos/:id` | `PUT` | Update status/judul todo |
| `/api/todos/:id` | `DELETE` | Hapus todo |

Aplikasi ini terus dikembangkan untuk eksplorasi *vibe coding* yang lebih seru! 🦊🚀
