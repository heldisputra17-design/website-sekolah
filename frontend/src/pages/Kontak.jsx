import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Kontak() {
  const [kontak, setKontak] = useState({});

  useEffect(() => {
    api.get('/kontak').then(r => setKontak(r.data)).catch(() => {});
  }, []);

  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>Kontak</h2>
          <p>Hubungi SD Negeri 004 Tenggarong</p>
        </div>

        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 30 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 20 }}>Informasi Kontak</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
                  <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, marginBottom: 3 }}>Alamat</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{kontak.alamat || '-'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
                  <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, marginBottom: 3 }}>Telepon</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{kontak.nomor_telepon || '-'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
                  <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, marginBottom: 3 }}>Email</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{kontak.email || '-'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
                  <div style={{ width: 45, height: 45, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, marginBottom: 3 }}>WhatsApp</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{kontak.whatsapp || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)', height: 400 }}>
              {kontak.google_maps ? (
                <iframe src={kontak.google_maps} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', color: '#999' }}>
                  <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-map-marked-alt" style={{ fontSize: 50, marginBottom: 10 }}></i>
                    <p>Peta belum tersedia</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
