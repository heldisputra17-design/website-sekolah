import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Footer() {
  const [kontak, setKontak] = useState({});
  useEffect(() => {
    api.get('/kontak').then(r => setKontak(r.data)).catch(() => {});
  }, []);

  return (
    <footer style={{ background: '#0d2b45', color: '#ccc', padding: '50px 0 20px' }}>
      <div className="container">
        <div className="grid grid-4" style={{ gap: 30 }}>
          <div>
            <h3 style={{ color: '#fff', marginBottom: 15, fontSize: 18 }}>SDN 004 Tenggarong</h3>
            <p style={{ fontSize: 14, lineHeight: 1.8 }}>
              Sekolah dasar negeri yang berkomitmen mencetak generasi unggul, berkarakter, dan berprestasi.
            </p>
          </div>
          <div>
            <h3 style={{ color: '#fff', marginBottom: 15, fontSize: 18 }}>Menu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Profil','Guru','Berita','Prestasi','Galeri','PPDB','Kontak'].map(m => (
                <Link key={m} to={`/${m.toLowerCase()}`} style={{ fontSize: 14, color: '#ccc' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#ccc'}
                >{m}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ color: '#fff', marginBottom: 15, fontSize: 18 }}>PPDB</h3>
            <p style={{ fontSize: 14, lineHeight: 1.8 }}>
              Informasi pendaftaran peserta didik baru.<br />
              <Link to="/ppdb" style={{ color: 'var(--accent)' }}>Info lengkap →</Link>
            </p>
          </div>
          <div>
            <h3 style={{ color: '#fff', marginBottom: 15, fontSize: 18 }}>Kontak</h3>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <p><i className="fas fa-map-marker-alt" style={{ width: 20 }}></i> {kontak.alamat}</p>
              <p><i className="fas fa-phone" style={{ width: 20 }}></i> {kontak.nomor_telepon}</p>
              <p><i className="fas fa-envelope" style={{ width: 20 }}></i> {kontak.email}</p>
              <p><i className="fab fa-whatsapp" style={{ width: 20 }}></i> {kontak.whatsapp}</p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 30, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 13 }}>
          &copy; {new Date().getFullYear()} SD Negeri 004 Tenggarong. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
