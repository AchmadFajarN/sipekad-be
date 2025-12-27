## PREREQUISITES
- Node Js
- PostgreSQL
- Browser
- Code Editor

# JALANKAN APLIKASI

## Buat Database Postgre
- Buat Database menggunakan akun postgres
```bash
sudo -u postgres psql
```
- Buat database
```sql
CREATE DATABASE sipekad
```
- Alter owner database ke database anda
```sql
ALTER DATABASE OWNER sipekad TO your_database_account
```
- Berikan privilege database ke akun postgre anda
```sql
GRANT ALL PRIVILEGES ON DATABASE sipekad TO your_database_account
```


## Install Package

- Clone repository
```bash
git clone git@github.com:AchmadFajarN/sipekad-be.git
```
- pindah direktori
```bash
cd sipekad-be
```
- Install Package
```bash
npm install
```

## Isi environment
- Buat file `.env` di root project secara manual atau:
```bash
touch .env
```
- Copy semua yang ada di `.env.example`, lalu paste ke file `.env` secara manual atau:
```bash
cp .env.example .env
```
- Pastikan isi file .env adalah seperti dibawah:
```env
DATABASE_URL=
JWT_SECRET=
PORT=4000
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS=
AWS_BUCKET_NAME=
AWS_REGION=
AWS_URL=
```

**Keterangan singkat:**
- `DATABASE_URL` → koneksi database
- `JWT_SECRET` → secret untuk tanda tangan JWT (minimal 32 karakter)
- `PORT` → port aplikasi berjalan
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS` → kredensial AWS
- `AWS_BUCKET_NAME` → bucket S3 untuk penyimpanan file
- `AWS_REGION` → region AWS
- `AWS_URL` → base URL akses file S3

> Format `JWT_SECRET` idealnya bisa menggunakan node JS, Contoh:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
## Migrate Database
- Setelah package terinstall, jalankan diterminal:
```bash
npm run migrate up
```
## Jalankan aplikasi
- Setelah semua tahapan diatas selesai jalankan aplikasi:
```bash
npm run dev
```
