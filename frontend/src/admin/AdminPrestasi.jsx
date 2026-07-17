import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminPrestasi() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: 'Akademik', prestasi: '', tanggal: '' });
  const [file, setFile] = useState(null);

  useEffect(() => { loadData(); }, []);
  const loadData = () => { api.get('/prestasi').then(r => setList(r.data)).catch(() => {}); };

  const openForm = (item) => {
    if (item) { setEdit(item); setForm({ judul: item.judul, deskripsi: item.deskripsi || '', kategori: item.kategori, prestasi: item.prestasi || '', tanggal: item.tanggal ? item.tanggal.split('T')[0] : '' }); }
    else { setEdit(null); setForm({ judul: '', deskripsi: '', kategori: 'Akademik', prestasi: '', tanggal: '' }); setFile(null); }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('foto', file);
    try {
      if (edit) await api.put(`/prestasi/${edit.id}`, fd);
      else await api.post('/prestasi', fd);
      loadData(); setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus prestasi ini?')) return;
    try { await api.delete(`/prestasi/${id}`); loadData(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'var(--primary)' }}>Kelola Prestasi</h2>
        <button onClick={() => openForm(null)} className="btn btn-primary"><i className="fas fa-plus"></i> Tambah Prestasi</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 15 }}>{edit ? 'Edit Prestasi' : 'Tambah Prestasi'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul</label>
              <input type="text" className="form-control" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea className="form-control" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label>Kategori</label>
                <select className="form-control" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}>
                  <option value="Akademik">Akademik</option>
                  <option value="Non-Akademik">Non-Akademik</option>
                </select>
              </div>
              <div className="form-group">
                <label>Prestasi</label>
                <input type="text" className="form-control" value={form.prestasi} onChange={e => setForm({...form, prestasi: e.target.value})} placeholder="Juara 1, dll" />
              </div>
              <div className="form-group">
                <label>Tanggal</label>
                <input type="date" className="form-control" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Foto</label>
              <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} accept="image/*" />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn" style={{ background: '#95a5a6', color: '#fff' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Prestasi</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id}>
                <td>{p.judul}</td>
                <td><span className={`badge ${p.kategori === 'Akademik' ? 'badge-success' : 'badge-warning'}`}>{p.kategori}</span></td>
                <td>{p.prestasi || '-'}</td>
                <td>{p.tanggal ? new Date(p.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                <td>
                  <button onClick={() => openForm(p)} className="btn" style={{ background: '#f39c12', color: '#fff', padding: '4px 10px', fontSize: 12, marginRight: 5 }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '4px 10px', fontSize: 12 }}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
