import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/dashboard').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Berita', value: stats.totalBerita, icon: 'fa-newspaper', color: '#3498db', to: '/admin/berita' },
    { label: 'Guru', value: stats.totalGuru, icon: 'fa-chalkboard-teacher', color: '#2ecc71', to: '/admin/guru' },
    { label: 'Prestasi', value: stats.totalPrestasi, icon: 'fa-trophy', color: '#f39c12', to: '/admin/prestasi' },
    { label: 'Album', value: stats.totalAlbum, icon: 'fa-images', color: '#9b59b6', to: '/admin/galeri' },
    { label: 'Agenda', value: stats.totalAgenda, icon: 'fa-calendar', color: '#e74c3c', to: '/admin/agenda' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, color: 'var(--primary)' }}>Dashboard</h2>
      <div className="grid grid-5" style={{ marginBottom: 30 }}>
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="card" style={{ padding: 20, textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <i className={`fas ${c.icon}`} style={{ color: '#fff', fontSize: 20 }}></i>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: c.color }}>{c.value || 0}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ marginBottom: 15, color: 'var(--primary)' }}>Berita Terbaru</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {(stats.beritaBaru || []).map(b => (
              <tr key={b.id}>
                <td>{b.judul}</td>
                <td><span className="badge badge-info">{b.kategori}</span></td>
                <td><span className={`badge ${b.status === 'publish' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span></td>
                <td style={{ fontSize: 13 }}>{new Date(b.created_at).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
