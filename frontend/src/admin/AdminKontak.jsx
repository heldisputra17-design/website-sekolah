import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminKontak() {
  const [form, setForm] = useState({ alamat: '', nomor_telepon: '', email: '', whatsapp: '', google_maps: '' });

  useEffect(() => {
    api.get('/kontak').then(r => {
      if (r.data) setForm({ alamat: r.data.alamat || '', nomor_telepon: r.data.nomor_telepon || '', email: r.data.email || '', whatsapp: r.data.whatsapp || '', google_maps: r.data.google_maps || '' });
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/kontak', form);
      alert('Kontak berhasil diperbarui');
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <h2 style={{ color: 'var(--primary)', marginBottom: 20 }}>Kelola Kontak</h2>
      <div className="card" style={{ padding: 20 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Alamat</label>
            <textarea className="form-control" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15 }}>
            <div className="form-group">
              <label>Nomor Telepon</label>
              <input type="text" className="form-control" value={form.nomor_telepon} onChange={e => setForm({...form, nomor_telepon: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input type="text" className="form-control" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Google Maps Embed URL</label>
            <input type="text" className="form-control" value={form.google_maps} onChange={e => setForm({...form, google_maps: e.target.value})} placeholder="<iframe src='...' />" />
          </div>
          <button type="submit" className="btn btn-primary">Simpan</button>
        </form>
      </div>
    </div>
  );
}
