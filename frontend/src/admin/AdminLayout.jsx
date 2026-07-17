import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-tachometer-alt' },
  { to: '/admin/berita', label: 'Berita', icon: 'fa-newspaper' },
  { to: '/admin/guru', label: 'Guru', icon: 'fa-chalkboard-teacher' },
  { to: '/admin/prestasi', label: 'Prestasi', icon: 'fa-trophy' },
  { to: '/admin/galeri', label: 'Galeri', icon: 'fa-images' },
  { to: '/admin/agenda', label: 'Agenda', icon: 'fa-calendar' },
  { to: '/admin/profil', label: 'Profil', icon: 'fa-info-circle' },
  { to: '/admin/ppdb', label: 'PPDB', icon: 'fa-user-plus' },
  { to: '/admin/kontak', label: 'Kontak', icon: 'fa-address-book' },
  { to: '/admin/user', label: 'User', icon: 'fa-users-cog' },
];

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: sidebarOpen ? 250 : 60,
        background: '#1a252f',
        color: '#fff',
        transition: 'width .3s',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100
      }}>
        <div style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <i className="fas fa-school" style={{ fontSize: 24 }}></i>
          {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>Admin SDN 004</span>}
        </div>
        <nav style={{ padding: '10px 0' }}>
          {menuItems.map(m => (
            <Link key={m.to} to={m.to} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px',
              color: location.pathname === m.to ? 'var(--accent)' : 'rgba(255,255,255,0.7)',
              background: location.pathname === m.to ? 'rgba(255,255,255,0.1)' : 'transparent',
              fontSize: 14, transition: 'all .3s', whiteSpace: 'nowrap'
            }}>
              <i className={`fas ${m.icon}`} style={{ fontSize: 16, width: 24, textAlign: 'center' }}></i>
              {sidebarOpen && <span>{m.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div style={{ marginLeft: sidebarOpen ? 250 : 60, flex: 1, transition: 'margin .3s', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          background: '#fff', padding: '10px 20px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>
              <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
            </button>
            <span style={{ fontWeight: 600, fontSize: 16, textTransform: 'capitalize' }}>
              {location.pathname.split('/').pop() || 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <span style={{ fontSize: 14, color: 'var(--text-light)' }}>
              <i className="fas fa-user"></i> {user?.nama || user?.username}
            </span>
            <button onClick={logout} className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '6px 15px', fontSize: 13 }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </header>
        <main style={{ padding: 20, flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
