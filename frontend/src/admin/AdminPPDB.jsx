import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminPPDB() {
  const [list, setList] = useState([]);
  const [files, setFiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ judul: '', konten: '', jenis: 'informasi' });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState('');

  useEffect(() => { loadData(); loadFiles(); }, []);

  const loadData = () => { api.get('/ppdb').then(r => setList(r.data)).catch(() => {}); };
  const loadFiles = () => { api.get('/ppdb/files').then(r => setFiles(r.data)).catch(() => {}); };

  const openForm = (item) => {
    if (item) { setEdit(item); setForm({ judul: item.judul, konten: item.konten || '', jenis: item.jenis }); }
    else { setEdit(null); setForm({ judul: '', konten: '', jenis: 'informasi' }); }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (edit) await api.put(`/ppdb/${edit.id}`, form);
      else await api.post('/ppdb', form);
      loadData(); setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus?')) return;
    try { await api.delete(`/ppdb/${id}`); loadData(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleUploadFile = async () => {
    if (!uploadFile) return;
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('nama_file', uploadName || uploadFile.name);
    try {
      await api.post('/ppdb/upload', fd);
      loadFiles();
      setUploadFile(null);
      setUploadName('');
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const deleteFile = async (id) => {
    if (!confirm('Hapus file?')) return;
    try { await api.delete(`/ppdb/file/${id}`); loadFiles(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <h2 style={{ color: 'var(--primary)', marginBottom: 20 }}>Kelola PPDB</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3>Tambah Konten</h3>
        <button onClick={() => openForm(null)} className="btn btn-primary"><i className="fas fa-plus"></i> Tambah</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3>{edit ? 'Edit' : 'Tambah'} Informasi PPDB</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label>Judul</label>
                <input type="text" className="form-control" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Jenis</label>
                <select className="form-control" value={form.jenis} onChange={e => setForm({...form, jenis: e.target.value})}>
                  <option value="informasi">Informasi</option>
                  <option value="persyaratan">Persyaratan</option>
                  <option value="jadwal">Jadwal</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Konten</label>
              <textarea className="form-control" value={form.konten} onChange={e => setForm({...form, konten: e.target.value})} rows={8} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn" style={{ background: '#95a5a6', color: '#fff' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <table className="table">
          <thead>
            <tr><th>Judul</th><th>Jenis</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id}>
                <td>{p.judul}</td>
                <td><span className="badge badge-info">{p.jenis}</span></td>
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

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ marginBottom: 15 }}>Download File / Formulir</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <input type="text" className="form-control" placeholder="Nama file" value={uploadName} onChange={e => setUploadName(e.target.value)} style={{ maxWidth: 300 }} />
          <input type="file" className="form-control" onChange={e => setUploadFile(e.target.files[0])} style={{ maxWidth: 300 }} />
          <button onClick={handleUploadFile} className="btn btn-primary">Upload</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Nama File</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {files.map(f => (
              <tr key={f.id}>
                <td><a href={`/uploads/${f.file}`} target="_blank" rel="noopener noreferrer">{f.nama_file}</a></td>
                <td>
                  <button onClick={() => deleteFile(f.id)} className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '4px 10px', fontSize: 12 }}>
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
