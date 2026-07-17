import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Prestasi() {
  const [prestasi, setPrestasi] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/prestasi').then(r => setPrestasi(r.data)).catch(() => {});
  }, []);

  const filtered = filter ? prestasi.filter(p => p.kategori === filter) : prestasi;

  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>Prestasi</h2>
          <p>Pencapaian membanggakan siswa dan guru SD Negeri 004 Tenggarong</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 30, justifyContent: 'center' }}>
          {['','Akademik','Non-Akademik'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : ''}`}
              style={{ background: filter === f ? 'var(--primary)' : '#fff', color: filter === f ? '#fff' : 'var(--text)', boxShadow: 'var(--shadow)' }}
            >{f || 'Semua'}</button>
          ))}
        </div>

        <div className="grid grid-3">
          {filtered.map(p => (
            <div key={p.id} className="card">
              <div style={{ height: 220, background: '#eee', overflow: 'hidden' }}>
                {p.foto ? <img src={`/uploads/${p.foto}`} alt={p.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-trophy" style={{ fontSize: 60, color: '#ddd' }}></i>
                    </div>}
              </div>
              <div style={{ padding: 20 }}>
                <span className={`badge ${p.kategori === 'Akademik' ? 'badge-success' : 'badge-warning'}`}>
                  {p.kategori}
                </span>
                <h3 style={{ margin: '10px 0', fontSize: 16 }}>{p.judul}</h3>
                {p.prestasi && <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{p.prestasi}</p>}
                {p.deskripsi && <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 8, lineHeight: 1.6 }}>{p.deskripsi}</p>}
                {p.tanggal && <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 8 }}>
                  <i className="far fa-calendar"></i> {new Date(p.tanggal).toLocaleDateString('id-ID')}
                </p>}
              </div>
            </div>
          ))}
        </div>
        {!filtered.length && <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 40 }}>Belum ada data prestasi.</p>}
      </div>
    </section>
  );
}
