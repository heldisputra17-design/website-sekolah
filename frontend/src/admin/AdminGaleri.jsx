import React, { useState, useEffect } from 'react';
import api from '../api';

function AdminAlbum({ refresh }) {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '' });
  const [file, setFile] = useState(null);
  const [detail, setDetail] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);

  useEffect(() => { load(); }, []);

  const load = () => api.get('/galeri/album').then(r => setList(r.data)).catch(() => {});

  const openForm = (item) => {
    if (item) { setEdit(item); setForm({ judul: item.judul, deskripsi: item.deskripsi || '' }); }
    else { setEdit(null); setForm({ judul: '', deskripsi: '' }); setFile(null); }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('judul', form.judul);
    fd.append('deskripsi', form.deskripsi);
    if (file) fd.append('cover', file);
    try {
      if (edit) await api.put(`/galeri/album/${edit.id}`, fd);
      else await api.post('/galeri/album', fd);
      load(); setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus album?')) return;
    try { await api.delete(`/galeri/album/${id}`); load(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const uploadFoto = async () => {
    if (!detail || !uploadFiles.length) return;
    const fd = new FormData();
    fd.append('album_id', detail.id);
    for (const f of uploadFiles) fd.append('foto', f);
    try {
      await api.post('/galeri/foto', fd);
      setUploadFiles([]);
      const res = await api.get(`/galeri/album/${detail.id}`);
      setDetail(res.data);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const deleteFoto = async (id) => {
    if (!confirm('Hapus foto?')) return;
    try {
      await api.delete(`/galeri/foto/${id}`);
      const res = await api.get(`/galeri/album/${detail.id}`);
      setDetail(res.data);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const loadDetail = async (id) => {
    const res = await api.get(`/galeri/album/${id}`);
    setDetail(res.data);
  };

  return (
    <div>
      {detail && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3>{detail.album.judul} <span style={{ fontSize: 13, color: 'var(--text-light)' }}>({detail.foto.length} foto)</span></h3>
            <button onClick={() => setDetail(null)} className="btn" style={{ background: '#95a5a6', color: '#fff', padding: '5px 15px' }}>Kembali</button>
          </div>
          <div className="form-group">
            <label>Tambah Foto</label>
            <input type="file" className="form-control" multiple accept="image/*" onChange={e => setUploadFiles([...e.target.files])} />
            {uploadFiles.length > 0 && <button onClick={uploadFoto} className="btn btn-primary" style={{ marginTop: 10 }}>Upload</button>}
          </div>
          <div className="grid grid-4" style={{ marginTop: 15 }}>
            {detail.foto.map(f => (
              <div key={f.id} className="card" style={{ position: 'relative' }}>
                <img src={`/uploads/${f.file}`} alt="" style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                <button onClick={() => deleteFoto(f.id)} className="btn" style={{ position: 'absolute', top: 5, right: 5, background: '#e74c3c', color: '#fff', padding: '3px 8px', fontSize: 11, borderRadius: '50%' }}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'var(--primary)' }}>Kelola Galeri</h2>
        <button onClick={() => openForm(null)} className="btn btn-primary"><i className="fas fa-plus"></i> Tambah Album</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 15 }}>{edit ? 'Edit Album' : 'Tambah Album'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul Album</label>
              <input type="text" className="form-control" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea className="form-control" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Cover</label>
              <input type="file" className="form-control" accept="image/*" onChange={e => setFile(e.target.files[0])} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn" style={{ background: '#95a5a6', color: '#fff' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-4">
        {list.map(a => (
          <div key={a.id} className="card" style={{ cursor: 'pointer' }} onClick={() => loadDetail(a.id)}>
            <div style={{ height: 150, background: '#eee', overflow: 'hidden' }}>
              {a.cover ? <img src={`/uploads/${a.cover}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    <i className="fas fa-images" style={{ fontSize: 30 }}></i>
                  </div>}
            </div>
            <div style={{ padding: 12 }}>
              <h4 style={{ fontSize: 14 }}>{a.judul}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{a.jumlah_foto} foto</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 5 }}>
                <button onClick={(e) => { e.stopPropagation(); openForm(a); }} className="btn" style={{ background: '#f39c12', color: '#fff', padding: '3px 8px', fontSize: 11 }}><i className="fas fa-edit"></i></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }} className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '3px 8px', fontSize: 11 }}><i className="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminGaleri() {
  return (
    <div>
      <AdminAlbum />
    </div>
  );
}
