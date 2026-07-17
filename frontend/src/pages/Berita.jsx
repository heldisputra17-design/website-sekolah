import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Berita() {
  const [berita, setBerita] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    api.get(`/berita?status=publish&limit=${perPage}&offset=${(page-1)*perPage}`)
      .then(r => setBerita(r.data)).catch(() => {});
  }, [page]);

  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>Berita</h2>
          <p>Informasi dan kegiatan terbaru SD Negeri 004 Tenggarong</p>
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
                <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span className="badge badge-info">{b.kategori}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-light)' }}>
                    <i className="far fa-calendar"></i> {new Date(b.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, lineHeight: 1.4, marginBottom: 10 }}>{b.judul}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-light)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {b.konten?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 10 }}>
                  <i className="far fa-eye"></i> {b.views} dilihat
                </p>
              </div>
            </Link>
          ))}
        </div>
        {!berita.length && <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 40 }}>Belum ada berita.</p>}
      </div>
    </section>
  );
}
