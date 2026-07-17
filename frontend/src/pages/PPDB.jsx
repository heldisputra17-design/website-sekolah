import React, { useState, useEffect } from 'react';
import api from '../api';

export default function PPDB() {
  const [data, setData] = useState([]);
  const [files, setFiles] = useState([]);
  const [tab, setTab] = useState('informasi');

  useEffect(() => {
    api.get('/ppdb').then(r => setData(r.data)).catch(() => {});
    api.get('/ppdb/files').then(r => setFiles(r.data)).catch(() => {});
  }, []);

  const byJenis = (jenis) => data.filter(d => d.jenis === jenis);

  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>PPDB</h2>
          <p>Penerimaan Peserta Didik Baru SD Negeri 004 Tenggarong</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 30, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['informasi','persyaratan','jadwal'].map(j => (
            <button key={j} onClick={() => setTab(j)}
              className={`btn ${tab === j ? 'btn-primary' : ''}`}
              style={{ background: tab === j ? 'var(--primary)' : '#fff', color: tab === j ? '#fff' : 'var(--text)', boxShadow: 'var(--shadow)', textTransform: 'capitalize' }}
            >{j}</button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 30 }}>
          {byJenis(tab).map(d => (
            <div key={d.id}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>{d.judul}</h3>
              <div style={{ lineHeight: 1.8 }}>{d.konten}</div>
            </div>
          ))}
          {!byJenis(tab).length && <p style={{ color: 'var(--text-light)' }}>Belum ada informasi {tab}.</p>}
        </div>

        {files.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 30, marginTop: 20 }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: 15 }}>Download Formulir</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {files.map(f => (
                <a key={f.id} href={`/uploads/${f.file}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 15px', background: '#f8f9fa', borderRadius: 'var(--radius)' }}>
                  <i className="fas fa-file-pdf" style={{ color: '#e74c3c' }}></i>
                  <span>{f.nama_file}</span>
                  <i className="fas fa-download" style={{ marginLeft: 'auto', color: 'var(--primary)' }}></i>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
