import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Beranda' },
    { to: '/profil/sejarah', label: 'Profil' },
    { to: '/guru', label: 'Guru' },
    { to: '/berita', label: 'Berita' },
    { to: '/prestasi', label: 'Prestasi' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/ppdb', label: 'PPDB' },
    { to: '/kontak', label: 'Kontak' },
  ];

  return (
    <nav style={{
      background: 'var(--primary)',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
          <i className="fas fa-school" style={{ fontSize: 28 }}></i>
          <span style={{ fontWeight: 700, fontSize: 18 }}>SDN 004 Tenggarong</span>
        </Link>

        <button onClick={() => setOpen(!open)} style={{
          display: 'none', background: 'none', border: 'none', color: '#fff',
          fontSize: 24, cursor: 'pointer'
        }} className="nav-toggle">
          <i className={`fas fa-${open ? 'times' : 'bars'}`}></i>
        </button>

        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }} className="nav-links">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              color: location.pathname === l.to ? 'var(--accent)' : '#fff',
              padding: '8px 14px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              transition: 'all .3s'
            }}
            onMouseEnter={e => { if (location.pathname !== l.to) e.target.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { if (location.pathname !== l.to) e.target.style.background = 'transparent' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          .nav-toggle{display:block!important}
          .nav-links{display:${open ? 'flex' : 'none'}!important;flex-direction:column;position:absolute;top:70px;left:0;right:0;background:var(--primary);padding:10px;box-shadow:0 5px 10px rgba(0,0,0,0.2)}
        }
      `}</style>
    </nav>
  );
}
