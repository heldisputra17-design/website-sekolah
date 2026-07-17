import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminProfil() {
  const [tab, setTab] = useState('sejarah');
  const [form, setForm] = useState({ konten: '' });
  const [file, setFile] = useState(null);

  const tabs = [
    { key: 'sejarah', label: 'Sejarah' },
    { key: 'visi', label: 'Visi' },
    { key: 'misi', label: 'Misi' },
    { key: 'sambutan', label: 'Sambutan KS' },
  ];

  useEffect(() => {
    api.get(`/profil/${tab}`).then(r => setForm({ konten: r.data.konten || '' })).catch(() => {});
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('konten', form.konten);
    if (file) fd.append('foto', file);
    try {
      await api.put(`/profil/${tab}`, fd);
      alert('Profil berhasil diperbarui');
      setFile(null);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <h2 style={{ color: 'var(--primary)', marginBottom: 20 }}>Kelola Profil Sekolah</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`btn ${tab === t.key ? 'btn-primary' : ''}`}
            style={{ background: tab === t.key ? 'var(--primary)' : '#fff', color: tab === t.key ? '#fff' : 'var(--text)', boxShadow: 'var(--shadow)' }}
          >{t.label}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ textTransform: 'capitalize' }}>Konten {tab}</label>
            <textarea className="form-control" value={form.konten} onChange={e => setForm({...form, konten: e.target.value})} rows={15} />
          </div>
          <div className="form-group">
            <label>Foto {tab === 'sambutan' ? 'Kepala Sekolah' : ''}</label>
            <input type="file" className="form-control" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          </div>
          <button type="submit" className="btn btn-primary">Simpan</button>
        </form>
      </div>
    </div>
  );
}
