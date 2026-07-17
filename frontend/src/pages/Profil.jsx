import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function Profil() {
  const { jenis } = useParams();
  const [data, setData] = useState({});
  const [org, setOrg] = useState([]);
  const [fasilitas, setFasilitas] = useState([]);

  useEffect(() => {
    if (['sejarah','visi','misi','sambutan'].includes(jenis)) {
      api.get(`/profil/${jenis}`).then(r => setData(r.data)).catch(() => {});
    }
    if (jenis === 'struktur') {
      api.get('/guru').then(r => setOrg(r.data)).catch(() => {});
    }
    if (jenis === 'fasilitas') {
      setFasilitas([]);
    }
  }, [jenis]);

  const menu = [
    { label: 'Sejarah', jenis: 'sejarah', icon: 'fa-history' },
    { label: 'Visi & Misi', jenis: 'visi', icon: 'fa-eye' },
    { label: 'Struktur Organisasi', jenis: 'struktur', icon: 'fa-sitemap' },
    { label: 'Fasilitas', jenis: 'fasilitas', icon: 'fa-building' },
  ];

  return (
    <section>
      <div className="container">
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 250px' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
              {menu.map(m => (
                <Link key={m.jenis} to={`/profil/${m.jenis}`} style={{
                  display: 'block', padding: '14px 20px', borderBottom: '1px solid #eee',
                  background: jenis === m.jenis ? 'var(--primary)' : 'transparent',
                  color: jenis === m.jenis ? '#fff' : 'var(--text)',
                  fontWeight: jenis === m.jenis ? 600 : 400,
                  transition: 'all .3s'
                }}>
                  <i className={`fas ${m.icon}`} style={{ width: 24 }}></i> {m.label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 30 }}>
            {jenis === 'sejarah' && (
              <>
                <h2 style={{ color: 'var(--primary)', marginBottom: 20 }}>Sejarah Sekolah</h2>
                <div style={{ lineHeight: 1.8, textAlign: 'justify' }}>{data.konten || 'Belum ada data.'}</div>
              </>
            )}
            {jenis === 'visi' && (
              <>
                <h2 style={{ color: 'var(--primary)', marginBottom: 20 }}>Visi & Misi</h2>
                <h3 style={{ marginBottom: 10, color: 'var(--accent)' }}>Visi</h3>
                <p style={{ lineHeight: 1.8, marginBottom: 30, fontStyle: 'italic', fontSize: 16 }}>
                  {data.konten || 'Belum ada data.'}
                </p>
              </>
            )}
            {jenis === 'struktur' && (
              <>
                <h2 style={{ color: 'var(--primary)', marginBottom: 20 }}>Struktur Organisasi</h2>
                <div className="grid grid-3">
                  {org.filter(g => ['Kepala Sekolah','Wakil Kepala Sekolah'].includes(g.jabatan)).map(g => (
                    <div key={g.id} style={{ textAlign: 'center', padding: 20 }}>
                      <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#eee', margin: '0 auto 10px', overflow: 'hidden', border: '3px solid var(--primary)' }}>
                        {g.foto ? <img src={`/uploads/${g.foto}`} alt={g.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <i className="fas fa-user-tie" style={{ fontSize: 40, lineHeight: '120px', color: '#999' }} />}
                      </div>
                      <h4>{g.nama}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{g.jabatan}</p>
                    </div>
                  ))}
                </div>
                <h3 style={{ margin: '30px 0 20px', color: 'var(--primary)' }}>Guru & Tenaga Pendidik</h3>
                <div className="grid grid-3">
                  {org.filter(g => !['Kepala Sekolah','Wakil Kepala Sekolah'].includes(g.jabatan)).map(g => (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 15, padding: 15, background: '#f8f9fa', borderRadius: 'var(--radius)' }}>
                      <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#eee', overflow: 'hidden', flexShrink: 0 }}>
                        {g.foto ? <img src={`/uploads/${g.foto}`} alt={g.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <i className="fas fa-user" style={{ lineHeight: '50px', width: '100%', textAlign: 'center', color: '#999' }} />}
                      </div>
                      <div>
                        <h5 style={{ fontSize: 14 }}>{g.nama}</h5>
                        <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{g.jabatan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
