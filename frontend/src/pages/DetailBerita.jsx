import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function DetailBerita() {
  const { slug } = useParams();
  const [berita, setBerita] = useState(null);
  const [terbaru, setTerbaru] = useState([]);

  useEffect(() => {
    api.get(`/berita/slug/${slug}`).then(r => setBerita(r.data)).catch(() => {});
    api.get('/berita?status=publish&limit=5').then(r => setTerbaru(r.data.filter(b => b.slug !== slug).slice(0, 4))).catch(() => {});
    window.scrollTo(0, 0);
  }, [slug]);

  if (!berita) return <div className="container loading"><i className="fas fa-spinner fa-spin"></i> Memuat...</div>;

  return (
    <section>
      <div className="container">
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
          <article style={{ flex: '1 1 700px', background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 30 }}>
            {berita.thumbnail && (
              <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 20 }}>
                <img src={`/uploads/${berita.thumbnail}`} alt={berita.judul} style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 15, marginBottom: 15, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-info">{berita.kategori}</span>
              <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
                <i className="far fa-calendar"></i> {new Date(berita.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
                <i className="far fa-user"></i> {berita.penulis}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
                <i className="far fa-eye"></i> {berita.views} dilihat
              </span>
            </div>
            <h1 style={{ color: 'var(--primary)', marginBottom: 20, fontSize: '1.8rem' }}>{berita.judul}</h1>
            <div style={{ lineHeight: 1.9, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: berita.konten }} />
            <div style={{ marginTop: 30 }}>
              <Link to="/berita" className="btn btn-primary"><i className="fas fa-arrow-left"></i> Kembali</Link>
            </div>
          </article>
          <aside style={{ flex: '0 0 300px' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 20 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>Berita Terbaru</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                {terbaru.map(b => (
                  <Link key={b.id} to={`/berita/${b.slug}`} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 70, height: 70, borderRadius: 8, background: '#eee', overflow: 'hidden', flexShrink: 0 }}>
                      {b.thumbnail ? <img src={`/uploads/${b.thumbnail}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <i className="fas fa-newspaper" style={{ lineHeight: '70px', width: '100%', textAlign: 'center', color: '#999' }} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 13, lineHeight: 1.4 }}>{b.judul}</h4>
                      <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
                        {new Date(b.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
