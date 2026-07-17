import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminBerita() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ judul: '', konten: '', kategori_id: '', status: 'draft', penulis: 'Admin' });
  const [file, setFile] = useState(null);
  const [kategori, setKategori] = useState([]);

  useEffect(() => {
    loadData();
    api.get('/berita/kategori').then(r => setKategori(r.data)).catch(() => {});
  }, []);

  const loadData = () => {
    api.get('/berita').then(r => setList(r.data)).catch(() => {});
  };

  const openForm = (item) => {
    if (item) { setEdit(item); setForm({ judul: item.judul, konten: item.konten, kategori_id: item.kategori_id || '', status: item.status, penulis: item.penulis }); }
    else { setEdit(null); setForm({ judul: '', konten: '', kategori_id: '', status: 'draft', penulis: 'Admin' }); setFile(null); }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('judul', form.judul);
    fd.append('konten', form.konten);
    fd.append('kategori_id', form.kategori_id);
    fd.append('status', form.status);
    fd.append('penulis', form.penulis);
    if (file) fd.append('thumbnail', file);
    try {
      if (edit) await api.put(`/berita/${edit.id}`, fd);
      else await api.post('/berita', fd);
      loadData();
      setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus berita ini?')) return;
    try {
      await api.delete(`/berita/${id}`);
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'var(--primary)' }}>Kelola Berita</h2>
        <button onClick={() => openForm(null)} className="btn btn-primary">
          <i className="fas fa-plus"></i> Tambah Berita
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 15 }}>{edit ? 'Edit Berita' : 'Tambah Berita'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul</label>
              <input type="text" className="form-control" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Konten</label>
              <textarea className="form-control" value={form.konten} onChange={e => setForm({...form, konten: e.target.value})} rows={10} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label>Kategori</label>
                <select className="form-control" value={form.kategori_id} onChange={e => setForm({...form, kategori_id: e.target.value})}>
                  <option value="">Pilih</option>
                  {kategori.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="draft">Draft</option>
                  <option value="publish">Publish</option>
                </select>
              </div>
              <div className="form-group">
                <label>Penulis</label>
                <input type="text" className="form-control" value={form.penulis} onChange={e => setForm({...form, penulis: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Thumbnail</label>
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
              <th>Penulis</th>
              <th>Status</th>
              <th>Views</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id}>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.judul}</td>
                <td><span className="badge badge-info">{b.kategori}</span></td>
                <td>{b.penulis}</td>
                <td><span className={`badge ${b.status === 'publish' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span></td>
                <td>{b.views}</td>
                <td style={{ fontSize: 13 }}>{new Date(b.created_at).toLocaleDateString('id-ID')}</td>
                <td>
                  <button onClick={() => openForm(b)} className="btn" style={{ background: '#f39c12', color: '#fff', padding: '4px 10px', fontSize: 12, marginRight: 5 }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '4px 10px', fontSize: 12 }}>
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
