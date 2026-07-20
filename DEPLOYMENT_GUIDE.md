# Panduan Deployment Website SDN 004 ke Vercel

## 📋 Prasyarat
- Akun Vercel (gratis di https://vercel.com)
- Domain `sdn004tenggarong.com` (sudah terdaftar)
- Database MySQL online (PlanetScale, Supabase, AWS RDS, dll)
- GitHub repository terhubung

## 🚀 Langkah-Langkah Deployment

### 1. Persiapan Database
1. Buat database online atau gunakan provider seperti:
   - **PlanetScale** (MySQL): https://planetscale.com
   - **Supabase** (PostgreSQL): https://supabase.com
   - **AWS RDS**: https://aws.amazon.com/rds

2. Catat credential database:
   - Host
   - Username
   - Password
   - Database Name

### 2. Deploy Frontend & Backend ke Vercel

#### Opsi A: Menggunakan Vercel Dashboard (Rekomendasi)

**A1. Deploy Backend terlebih dahulu:**
1. Buka https://vercel.com/new
2. Pilih GitHub dan authorize
3. Pilih repository `website-sekolah`
4. Di "Root Directory", pilih `backend`
5. Di "Environment Variables", tambahkan:
   ```
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_secret_key_123
   PORT=3001
   NODE_ENV=production
   ```
6. Klik "Deploy"
7. Tunggu hingga deployment selesai
8. Catat URL backend (misal: `backend-xyz.vercel.app`)

**A2. Deploy Frontend:**
1. Buka https://vercel.com/new (lagi)
2. Pilih repository yang sama
3. Di "Root Directory", pilih `frontend`
4. Di "Build and Output Settings":
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Di "Environment Variables", tambahkan:
   ```
   VITE_API_URL=https://backend-xyz.vercel.app
   ```
   (ganti dengan URL backend Anda)
6. Klik "Deploy"

#### Opsi B: Menggunakan Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy backend
cd backend
vercel --prod --name sdn004-backend
# Catat URL yang diberikan

# Deploy frontend
cd ../frontend
vercel --prod --name sdn004-frontend
# Set VITE_API_URL ke URL backend
```

### 3. Setup Domain Custom `sdn004tenggarong.com`

**Di Vercel Dashboard:**
1. Pilih frontend project
2. Settings → Domains
3. Klik "Add"
4. Masukkan: `sdn004tenggarong.com`
5. Pilih opsi DNS configuration

**Di Registrar Domain Anda (GoDaddy, Namecheap, etc):**
1. Login ke registrar domain
2. Pergi ke DNS Management
3. Pilih salah satu cara:

   **Cara 1: Update Nameserver (Recommended)**
   - Ganti nameserver ke:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```

   **Cara 2: Tambah CNAME Record**
   - Buat CNAME record:
     ```
     Host: sdn004tenggarong.com
     Points to: cname.vercel-dns.com
     TTL: 3600
     ```

4. Tunggu propagasi DNS (5-48 jam)

### 4. (Opsional) Setup Subdomain untuk API

Jika ingin menggunakan `api.sdn004tenggarong.com`:

1. Di Vercel (Backend Project) → Settings → Domains
2. Tambahkan: `api.sdn004tenggarong.com`
3. Update frontend `.env.production`:
   ```
   VITE_API_URL=https://api.sdn004tenggarong.com
   ```

### 5. Verifikasi Deployment

✅ **Testing Frontend:**
```bash
curl https://sdn004tenggarong.com
```

✅ **Testing Backend:**
```bash
curl https://api.sdn004tenggarong.com/api/health
```

✅ **Testing API Connection:**
Buka https://sdn004tenggarong.com di browser, lihat di DevTools → Network apakah API calls berhasil.

## 🔐 Security Notes

1. **Jangan expose environment variables** di frontend
2. **Gunakan JWT tokens** untuk authentication
3. **Enable CORS** hanya untuk domain yang diperlukan
4. **Update `.gitignore`** untuk mencegah commit `.env`

## 📝 Environment Variables Checklist

### Backend (vercel.json atau Vercel Dashboard)
- [ ] DB_HOST
- [ ] DB_USER
- [ ] DB_PASSWORD
- [ ] DB_NAME
- [ ] JWT_SECRET
- [ ] PORT=3001
- [ ] NODE_ENV=production

### Frontend (.env.production)
- [ ] VITE_API_URL=https://api.sdn004tenggarong.com

## 🆘 Troubleshooting

### ❌ Error: "Cannot connect to database"
- Periksa kredensial database di Vercel Environment Variables
- Pastikan IP Vercel ditambahkan ke whitelist database
- Tes koneksi database secara lokal terlebih dahulu

### ❌ Error: "CORS error"
- Pastikan domain sudah ditambahkan di CORS options di `backend/server.js`
- Periksa browser console untuk error message spesifik
- Clear browser cache dan hard refresh

### ❌ Error: "API 404 Not Found"
- Periksa VITE_API_URL di frontend .env.production
- Pastikan backend route sudah benar
- Test dengan: `curl https://api.sdn004tenggarong.com/api/health`

### ❌ Domain tidak ter-setup
- Tunggu DNS propagation (hingga 48 jam)
- Use online tool: https://dns.google/
- Verifikasi nameserver atau CNAME record yang sudah ditambahkan

## 📚 Resources

- Vercel Documentation: https://vercel.com/docs
- React + Vite: https://vitejs.dev/guide/
- Express.js: https://expressjs.com/
- PlanetScale Setup: https://planetscale.com/docs

## ✅ Deployment Checklist

- [ ] Database sudah online dan accessible
- [ ] Environment variables sudah set di Vercel
- [ ] Backend deployment berhasil
- [ ] Frontend deployment berhasil
- [ ] Domain DNS sudah dikonfigurasi
- [ ] Frontend dapat berkomunikasi dengan backend
- [ ] Testing semua fitur utama (login, upload, dll)

---

**Untuk bantuan lebih lanjut, hubungi GitHub Copilot atau Vercel Support.**
