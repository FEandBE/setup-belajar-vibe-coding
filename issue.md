# Perencanaan: Pembuatan Unit Test untuk API Users

## Tujuan
Mengimplementasikan *unit test* yang komprehensif untuk seluruh endpoint API yang tersedia pada modul Users. Pengujian ini menggunakan *test runner* bawaan `bun test` untuk menjamin kualitas dan stabilitas API.

## Spesifikasi Kebutuhan

1. **Lokasi File**: Seluruh file test harus diletakkan di dalam folder `test/` (misalnya `test/user.test.ts`).
2. **Framework Tes**: Menggunakan `bun test` (`describe`, `expect`, `it`, `beforeEach`, `afterEach`, dll).
3. **Konsistensi Data (Teardown/Setup)**: Untuk menjamin agar setiap skenario tes *independent* (tidak saling mempengaruhi kualitas tes lainnya), **pastikan untuk selalu menghapus dan membersihkan data di database (tabel `users` dan `sessions`) sebelum setiap eksekusi tes berjalan** menggunakan hook `beforeEach`.

---

## Daftar Endpoint & Skenario Pengujian

Gunakan daftar skenario di bawah ini sebagai acuan utama dalam penulisan tes. Detail koding (seperti ekspektasi *status code* atau properti JSON) dibebaskan kepada pengembang selama sesuai dengan logika bisnis aplikasi.

### 1. Endpoint: `POST /api/users` (Registrasi)
**Skenario yang harus diuji:**
- [ ] Harus berhasil mendaftarkan user baru dengan payload data yang valid.
- [ ] Harus gagal apabila mencoba mendaftarkan user dengan email yang sudah ada di database.
- [ ] Harus gagal (Validasi Error) apabila input nama terlalu pendek atau nama melebihi batas maksimal karakter.
- [ ] Harus gagal (Validasi Error) apabila format email sembarangan (tidak valid).
- [ ] Harus gagal (Validasi Error) apabila input password terlalu pendek atau melebihi batas karakter.
- [ ] Harus gagal apabila ada field wajib (nama/email/password) yang sengaja dikosongkan.

### 2. Endpoint: `POST /api/users/login` (Login)
**Skenario yang harus diuji:**
- [ ] Harus berhasil login menggunakan kredensial (email & password) yang valid, dan mengembalikan token sesi (UUID).
- [ ] Token dari respons login yang sukses harus tercatat/tersimpan di tabel `sessions`.
- [ ] Harus gagal apabila email yang dimasukkan sama sekali tidak terdaftar.
- [ ] Harus gagal apabila password yang diinputkan salah.
- [ ] Harus gagal (Validasi Error) apabila payload tidak lengkap (misal tidak mengirim email atau password).

### 3. Endpoint: `GET /api/users/current` (Profil User Saat ini)
**Skenario yang harus diuji:**
- [ ] Harus berhasil mengembalikan data profil pengguna (nama, email, id) apabila menyisipkan Header `Authorization: Bearer <token_valid>`.
- [ ] Harus gagal (Unauthorized) apabila tidak mengirim Header Authorization sama sekali.
- [ ] Harus gagal (Unauthorized) apabila mengirim token yang fiktif atau salah.
- [ ] Harus gagal (Unauthorized) apabila prefix kata "Bearer " tidak disertakan pada header.

### 4. Endpoint: `DELETE /api/users/logout` (Logout)
**Skenario yang harus diuji:**
- [ ] Harus berhasil memproses perintah logout dan mengembalikan status 'ok' jika menggunakan token Bearer yang valid.
- [ ] Harus dipastikan bahwa token yang digunakan saat logout tersebut sudah benar-benar hilang/terhapus dari dalam tabel `sessions` pasca eksekusi.
- [ ] Tes lanjutan: Setelah berhasil logout, pastikan token tersebut sudah tidak bisa lagi dipakai untuk mengakses endpoint profil (`GET /api/users/current`).
- [ ] Harus gagal (Unauthorized) apabila mencoba memanggil endpoint logout tanpa menyertakan token otentikasi.
- [ ] Harus gagal (Unauthorized) apabila menggunakan otentikasi palsu (token tidak terdaftar).

---
*Catatan untuk Implementator: Fokus pada pencapaian kelulusan seluruh *checklist* skenario di atas. Silakan bangun fungsionalitas dummy/seed sewajarnya di dalam blok test.*
