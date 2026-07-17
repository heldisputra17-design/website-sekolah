import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Beranda from './pages/Beranda';
import Profil from './pages/Profil';
import Guru from './pages/Guru';
import Berita from './pages/Berita';
import DetailBerita from './pages/DetailBerita';
import Prestasi from './pages/Prestasi';
import Galeri from './pages/Galeri';
import DetailAlbum from './pages/DetailAlbum';
import PPDB from './pages/PPDB';
import Kontak from './pages/Kontak';

import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import AdminBerita from './admin/AdminBerita';
import AdminGuru from './admin/AdminGuru';
import AdminPrestasi from './admin/AdminPrestasi';
import AdminGaleri from './admin/AdminGaleri';
import AdminAgenda from './admin/AdminAgenda';
import AdminProfil from './admin/AdminProfil';
import AdminPPDB from './admin/AdminPPDB';
import AdminKontak from './admin/AdminKontak';
import AdminUser from './admin/AdminUser';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="berita" element={<AdminBerita />} />
          <Route path="guru" element={<AdminGuru />} />
          <Route path="prestasi" element={<AdminPrestasi />} />
          <Route path="galeri" element={<AdminGaleri />} />
          <Route path="agenda" element={<AdminAgenda />} />
          <Route path="profil" element={<AdminProfil />} />
          <Route path="ppdb" element={<AdminPPDB />} />
          <Route path="kontak" element={<AdminKontak />} />
          <Route path="user" element={<AdminUser />} />
        </Route>
        <Route path="*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Beranda />} />
                <Route path="/profil/:jenis" element={<Profil />} />
                <Route path="/guru" element={<Guru />} />
                <Route path="/berita" element={<Berita />} />
                <Route path="/berita/:slug" element={<DetailBerita />} />
                <Route path="/prestasi" element={<Prestasi />} />
                <Route path="/galeri" element={<Galeri />} />
                <Route path="/galeri/:id" element={<DetailAlbum />} />
                <Route path="/ppdb" element={<PPDB />} />
                <Route path="/kontak" element={<Kontak />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </>
  );
}
