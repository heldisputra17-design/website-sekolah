import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a5276 0%, #2980b9 50%, #3498db 100%)',
      color: '#fff', padding: '100px 0', textAlign: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div className="container">
        <h1 style={{ fontSize: '2.8rem', marginBottom: 20, fontWeight: 800 }}>
          Selamat Datang di SD Negeri 004 Tenggarong
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: 30, maxWidth: 700, margin: '0 auto 30px' }}>
          Membangun generasi cerdas, berkarakter, dan berprestasi menuju masa depan gemilang.
        </p>
        <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/profil/sejarah" className="btn btn-accent" style={{ fontSize: 16, padding: '12px 30px' }}>
            <i className="fas fa-info-circle"></i> Profil Sekolah
          </Link>
          <Link to="/ppdb" className="btn" style={{ background: '#fff', color: 'var(--primary)', fontSize: 16, padding: '12px 30px' }}>
            <i className="fas fa-user-plus"></i> Info PPDB
          </Link>
        </div>
      </div>
    </section>
  );
}

function Sambutan() {
  const [data, setData] = useState({});
  useEffect(() => { api.get('/profil/sambutan').then(r => setData(r.data)).catch(() => {}); }, []);
  return (
    <section style={{ background: '#fff' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 250px', textAlign: 'center' }}>
            <div style={{
              width: 200, height: 200, borderRadius: '50%', background: '#eee',
              margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', border: '4px solid var(--primary)'
            }}>
              {data.foto ? <img src={`/uploads/${data.foto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <i className="fas fa-user-tie" style={{ fontSize: 60, color: '#999' }} />}
            </div>
            <h4 style={{ color: 'var(--primary)' }}>Kepala Sekolah</h4>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: 15 }}>Sambutan Kepala Sekolah</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--text)', textAlign: 'justify' }}>
              {data.konten || 'Selamat datang di website SD Negeri 004 Tenggarong. Website ini hadir sebagai sarana informasi dan komunikasi antara sekolah dengan orang tua, siswa, dan masyarakat.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Statistik() {
  const [stats, setStats] = useState([]);
  useEffect(() => { api.get('/statistik').then(r => setStats(r.data)).catch(() => {}); }, []);
  return (
    <section style={{ background: 'linear-gradient(135deg, #1a5276, #2980b9)', color: '#fff' }}>
      <div className="container">
        <div className="grid grid-4" style={{ textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i}>
              <i className={s.icon} style={{ fontSize: 40, marginBottom: 10, color: 'var(--accent)' }}></i>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{s.nilai}</h3>
              <p style={{ opacity: 0.9, fontSize: 16 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeritaTerbaru() {
  const [berita, setBerita] = useState([]);
  useEffect(() => {
    api.get('/berita?status=publish&limit=3').then(r => setBerita(r.data)).catch(() => {});
  }, []);
  return (
    <section style={{ background: '#fff' }}>
      <div className="container">
        <div className="section-title">
          <h2>Berita Terbaru</h2>
          <p>Informasi terkini seputar kegiatan sekolah</p>
        </div>
        <div className="grid grid-3">
          {berita.map(b => (
            <Link key={b.id} to={`/berita/${b.slug}`} className="card">
              <div style={{ height: 200, background: '#eee', overflow: 'hidden' }}>
                {b.thumbnail ? <img src={`/uploads/${b.thumbnail}`} alt={b.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      <i className="fas fa-newspaper" style={{ fontSize: 40 }}></i>
                    </div>}
              </div>
              <div style={{ padding: 20 }}>
                <span className="badge badge-info">{b.kategori}</span>
                <h3 style={{ margin: '10px 0', fontSize: 16, lineHeight: 1.4 }}>{b.judul}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-light)' }}>
                  <i className="far fa-calendar"></i> {new Date(b.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {berita.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link to="/berita" className="btn btn-primary">Lihat Semua Berita</Link>
          </div>
        )}
      </div>
    </section>
  );
}

function PrestasiSection() {
  const [prestasi, setPrestasi] = useState([]);
  useEffect(() => {
    api.get('/prestasi').then(r => setPrestasi(r.data.slice(0, 4))).catch(() => {});
  }, []);
  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>Prestasi</h2>
          <p>Pencapaian terbaik siswa dan guru</p>
        </div>
        <div className="grid grid-4">
          {prestasi.map(p => (
            <div key={p.id} className="card" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ height: 150, background: '#eee', marginBottom: 15, borderRadius: 8, overflow: 'hidden' }}>
                {p.foto ? <img src={`/uploads/${p.foto}`} alt={p.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      <i className="fas fa-trophy" style={{ fontSize: 40 }}></i>
                    </div>}
              </div>
              <span className={`badge ${p.kategori === 'Akademik' ? 'badge-success' : 'badge-warning'}`}>{p.kategori}</span>
              <h4 style={{ margin: '10px 0', fontSize: 14 }}>{p.judul}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{p.prestasi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgendaSection() {
  const [agenda, setAgenda] = useState([]);
  useEffect(() => {
    api.get('/agenda').then(r => setAgenda(r.data.slice(0, 4))).catch(() => {});
  }, []);
  if (!agenda.length) return null;
  return (
    <section style={{ background: '#fff' }}>
      <div className="container">
        <div className="section-title">
          <h2>Agenda</h2>
          <p>Kegiatan dan jadwal sekolah</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {agenda.map(a => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 20, padding: 20,
              background: '#f8f9fa', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--primary)'
            }}>
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>
                  {new Date(a.tanggal_mulai).getDate()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
                  {new Date(a.tanggal_mulai).toLocaleDateString('id-ID', { month: 'short' })}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: 5 }}>{a.judul}</h4>
                {a.lokasi && <p style={{ fontSize: 13, color: 'var(--text-light)' }}>
                  <i className="fas fa-map-marker-alt"></i> {a.lokasi}
                  {a.waktu && ` | ${a.waktu}`}
                </p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GaleriSection() {
  const [albums, setAlbums] = useState([]);
  useEffect(() => {
    api.get('/galeri/album').then(r => setAlbums(r.data.slice(0, 4))).catch(() => {});
  }, []);
  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>Galeri</h2>
          <p>Dokumentasi kegiatan sekolah</p>
        </div>
        <div className="grid grid-4">
          {albums.map(a => (
            <Link key={a.id} to={`/galeri/${a.id}`} className="card">
              <div style={{ height: 180, background: '#eee', overflow: 'hidden' }}>
                {a.cover ? <img src={`/uploads/${a.cover}`} alt={a.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      <i className="fas fa-images" style={{ fontSize: 40 }}></i>
                    </div>}
              </div>
              <div style={{ padding: 15 }}>
                <h4 style={{ fontSize: 14, marginBottom: 5 }}>{a.judul}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-light)' }}>
                  <i className="far fa-images"></i> {a.jumlah_foto} foto
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Beranda() {
  return (
    <>
      <Hero />
      <Sambutan />
      <Statistik />
      <BeritaTerbaru />
      <PrestasiSection />
      <AgendaSection />
      <GaleriSection />
    </>
  );
}
