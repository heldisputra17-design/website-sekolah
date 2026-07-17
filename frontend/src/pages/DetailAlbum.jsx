import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function DetailAlbum() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    api.get(`/galeri/album/${id}`).then(r => setAlbum(r.data)).catch(() => {});
    window.scrollTo(0, 0);
  }, [id]);

  if (!album) return <div className="container loading"><i className="fas fa-spinner fa-spin"></i> Memuat...</div>;

  return (
    <section>
      <div className="container">
        <Link to="/galeri" className="btn btn-primary" style={{ marginBottom: 20 }}>
          <i className="fas fa-arrow-left"></i> Kembali ke Galeri
        </Link>
        <div className="section-title">
          <h2>{album.album.judul}</h2>
          {album.album.deskripsi && <p>{album.album.deskripsi}</p>}
        </div>

        <div className="grid grid-3">
          {album.foto.map(f => (
            <div key={f.id} className="card">
              <a href={`/uploads/${f.file}`} target="_blank" rel="noopener noreferrer">
                <div style={{ height: 250, background: '#eee', overflow: 'hidden' }}>
                  <img src={`/uploads/${f.file}`} alt={f.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                </div>
              </a>
              {f.caption && (
                <div style={{ padding: 10, textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{f.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {!album.foto.length && <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 40 }}>Belum ada foto dalam album ini.</p>}
      </div>
    </section>
  );
}
