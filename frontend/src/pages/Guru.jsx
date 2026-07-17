import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Guru() {
  const [guru, setGuru] = useState([]);
  const [search, setSearch] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('');

  useEffect(() => {
    api.get('/guru').then(r => setGuru(r.data)).catch(() => {});
  }, []);

  const jabatanList = [...new Set(guru.map(g => g.jabatan).filter(Boolean))];
  const filtered = guru.filter(g =>
    (!search || g.nama.toLowerCase().includes(search.toLowerCase())) &&
    (!filterJabatan || g.jabatan === filterJabatan)
  );

  const kepala = filtered.filter(g => g.jabatan === 'Kepala Sekolah');
  const lainnya = filtered.filter(g => g.jabatan !== 'Kepala Sekolah');

  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>Guru & Tenaga Pendidik</h2>
          <p>Tenaga pendidik profesional SD Negeri 004 Tenggarong</p>
        </div>

        <div style={{ display: 'flex', gap: 15, marginBottom: 30, flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari guru..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <select className="form-control" value={filterJabatan} onChange={e => setFilterJabatan(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="">Semua Jabatan</option>
            {jabatanList.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        {kepala.length > 0 && (
          <>
            <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}>Kepala Sekolah</h3>
            <div className="grid grid-4" style={{ marginBottom: 40 }}>
              {kepala.map(g => (
                <div key={g.id} className="card" style={{ textAlign: 'center', padding: 25 }}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#eee', margin: '0 auto 15px', overflow: 'hidden', border: '3px solid var(--accent)' }}>
                    {g.foto ? <img src={`/uploads/${g.foto}`} alt={g.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <i className="fas fa-user-tie" style={{ fontSize: 40, lineHeight: '120px', color: '#999' }} />}
                  </div>
                  <h4>{g.nama}</h4>
                  {g.nip && <p style={{ fontSize: 12, color: 'var(--text-light)' }}>NIP. {g.nip}</p>}
                  <p style={{ fontSize: 13, marginTop: 5 }}>{g.jabatan}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}>Guru & Tenaga Pendidik</h3>
        <div className="grid grid-4">
          {lainnya.map(g => (
            <div key={g.id} className="card" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#eee', margin: '0 auto 10px', overflow: 'hidden', border: '3px solid var(--primary)' }}>
                {g.foto ? <img src={`/uploads/${g.foto}`} alt={g.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <i className="fas fa-user" style={{ fontSize: 30, lineHeight: '100px', color: '#999' }} />}
              </div>
              <h4 style={{ fontSize: 15 }}>{g.nama}</h4>
              {g.nip && <p style={{ fontSize: 11, color: 'var(--text-light)' }}>NIP. {g.nip}</p>}
              <p style={{ fontSize: 13, marginTop: 3 }}>{g.jabatan}</p>
              {g.mapel && <span className="badge badge-info" style={{ marginTop: 5 }}>{g.mapel}</span>}
            </div>
          ))}
        </div>
        {!filtered.length && <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 40 }}>Tidak ada data guru.</p>}
      </div>
    </section>
  );
}
