import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Galeri() {
  const [albums, setAlbums] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tab, setTab] = useState('album');

  useEffect(() => {
    api.get('/galeri/album').then(r => setAlbums(r.data)).catch(() => {});
    api.get('/galeri/video').then(r => setVideos(r.data)).catch(() => {});
  }, []);

  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>Galeri</h2>
          <p>Dokumentasi kegiatan dan momen SD Negeri 004 Tenggarong</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 30, justifyContent: 'center' }}>
          <button onClick={() => setTab('album')}
            className={`btn ${tab === 'album' ? 'btn-primary' : ''}`}
            style={{ background: tab === 'album' ? 'var(--primary)' : '#fff', color: tab === 'album' ? '#fff' : 'var(--text)', boxShadow: 'var(--shadow)' }}
          ><i className="fas fa-images"></i> Album Foto</button>
          <button onClick={() => setTab('video')}
            className={`btn ${tab === 'video' ? 'btn-primary' : ''}`}
            style={{ background: tab === 'video' ? 'var(--primary)' : '#fff', color: tab === 'video' ? '#fff' : 'var(--text)', boxShadow: 'var(--shadow)' }}
          ><i className="fas fa-video"></i> Video</button>
        </div>

        {tab === 'album' && (
          <div className="grid grid-3">
            {albums.map(a => (
              <Link key={a.id} to={`/galeri/${a.id}`} className="card">
                <div style={{ height: 220, background: '#eee', overflow: 'hidden' }}>
                  {a.cover ? <img src={`/uploads/${a.cover}`} alt={a.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-images" style={{ fontSize: 50, color: '#ddd' }}></i>
                      </div>}
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 8 }}>{a.judul}</h3>
                  {a.deskripsi && <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 8 }}>{a.deskripsi}</p>}
                  <p style={{ fontSize: 12, color: 'var(--text-light)' }}>
                    <i className="far fa-images"></i> {a.jumlah_foto} foto
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === 'video' && (
          <div className="grid grid-3">
            {videos.map(v => (
              <div key={v.id} className="card">
                <div style={{ height: 220, background: '#eee', overflow: 'hidden', position: 'relative' }}>
                  {v.thumbnail ? <img src={`/uploads/${v.thumbnail}`} alt={v.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-video" style={{ fontSize: 50, color: '#ddd' }}></i>
                      </div>}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                    <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: 50 }}>
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16 }}>{v.judul}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'album' && !albums.length && <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 40 }}>Belum ada album foto.</p>}
        {tab === 'video' && !videos.length && <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 40 }}>Belum ada video.</p>}
      </div>
    </section>
  );
}
