import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminGuru() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ nama: '', nip: '', jabatan: '', mapel: '', pendidikan: '', status_kepegawaian: 'Honorer', tampil_di_website: 1 });
  const [file, setFile] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = () => { api.get('/guru/all').then(r => setList(r.data)).catch(() => {}); };

  const openForm = (item) => {
    if (item) { setEdit(item); setForm({ nama: item.nama, nip: item.nip || '', jabatan: item.jabatan || '', mapel: item.mapel || '', pendidikan: item.pendidikan || '', status_kepegawaian: item.status_kepegawaian, tampil_di_website: item.tampil_di_website }); }
    else { setEdit(null); setForm({ nama: '', nip: '', jabatan: '', mapel: '', pendidikan: '', status_kepegawaian: 'Honorer', tampil_di_website: 1 }); setFile(null); }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('foto', file);
    try {
      if (edit) await api.put(`/guru/${edit.id}`, fd);
      else await api.post('/guru', fd);
      loadData(); setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus guru ini?')) return;
    try { await api.delete(`/guru/${id}`); loadData(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'var(--primary)' }}>Kelola Guru</h2>
        <button onClick={() => openForm(null)} className="btn btn-primary"><i className="fas fa-plus"></i> Tambah Guru</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 15 }}>{edit ? 'Edit Guru' : 'Tambah Guru'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label>Nama</label>
                <input type="text" className="form-control" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>NIP</label>
                <input type="text" className="form-control" value={form.nip} onChange={e => setForm({...form, nip: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Jabatan</label>
                <input type="text" className="form-control" value={form.jabatan} onChange={e => setForm({...form, jabatan: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Mata Pelajaran</label>
                <input type="text" className="form-control" value={form.mapel} onChange={e => setForm({...form, mapel: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Pendidikan</label>
                <input type="text" className="form-control" value={form.pendidikan} onChange={e => setForm({...form, pendidikan: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Status Kepegawaian</label>
                <select className="form-control" value={form.status_kepegawaian} onChange={e => setForm({...form, status_kepegawaian: e.target.value})}>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="Honorer">Honorer</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Tampil di Website</label>
              <select className="form-control" value={form.tampil_di_website} onChange={e => setForm({...form, tampil_di_website: parseInt(e.target.value)})}>
                <option value={1}>Ya</option>
                <option value={0}>Tidak</option>
              </select>
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
              <th>Foto</th>
              <th>Nama</th>
              <th>NIP</th>
              <th>Jabatan</th>
              <th>Mapel</th>
              <th>Status</th>
              <th>Tampil</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map(g => (
              <tr key={g.id}>
                <td>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                    {g.foto ? <img src={`/uploads/${g.foto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <i className="fas fa-user" style={{ lineHeight: '40px', width: '100%', textAlign: 'center', color: '#999' }} />}
                  </div>
                </td>
                <td>{g.nama}</td>
                <td>{g.nip || '-'}</td>
                <td>{g.jabatan}</td>
                <td>{g.mapel || '-'}</td>
                <td><span className="badge badge-info">{g.status_kepegawaian}</span></td>
                <td>{g.tampil_di_website ? <span className="badge badge-success">Ya</span> : <span className="badge badge-danger">Tidak</span>}</td>
                <td>
                  <button onClick={() => openForm(g)} className="btn" style={{ background: '#f39c12', color: '#fff', padding: '4px 10px', fontSize: 12, marginRight: 5 }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(g.id)} className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '4px 10px', fontSize: 12 }}>
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
