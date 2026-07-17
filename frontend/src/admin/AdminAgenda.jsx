import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminAgenda() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', tanggal_mulai: '', tanggal_selesai: '', waktu: '', lokasi: '' });

  useEffect(() => { loadData(); }, []);
  const loadData = () => { api.get('/agenda/all').then(r => setList(r.data)).catch(() => {}); };

  const openForm = (item) => {
    if (item) {
      setEdit(item);
      setForm({
        judul: item.judul, deskripsi: item.deskripsi || '',
        tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : '',
        tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.split('T')[0] : '',
        waktu: item.waktu || '', lokasi: item.lokasi || ''
      });
    } else {
      setEdit(null);
      setForm({ judul: '', deskripsi: '', tanggal_mulai: '', tanggal_selesai: '', waktu: '', lokasi: '' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (edit) await api.put(`/agenda/${edit.id}`, form);
      else await api.post('/agenda', form);
      loadData(); setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus agenda?')) return;
    try { await api.delete(`/agenda/${id}`); loadData(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'var(--primary)' }}>Kelola Agenda</h2>
        <button onClick={() => openForm(null)} className="btn btn-primary"><i className="fas fa-plus"></i> Tambah Agenda</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 15 }}>{edit ? 'Edit Agenda' : 'Tambah Agenda'}</h3>
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
                <label>Tanggal Mulai</label>
                <input type="date" className="form-control" value={form.tanggal_mulai} onChange={e => setForm({...form, tanggal_mulai: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tanggal Selesai</label>
                <input type="date" className="form-control" value={form.tanggal_selesai} onChange={e => setForm({...form, tanggal_selesai: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Waktu</label>
                <input type="time" className="form-control" value={form.waktu} onChange={e => setForm({...form, waktu: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Lokasi</label>
              <input type="text" className="form-control" value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})} />
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
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Lokasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id}>
                <td>{a.judul}</td>
                <td>{new Date(a.tanggal_mulai).toLocaleDateString('id-ID')}{a.tanggal_selesai !== a.tanggal_mulai ? ` - ${new Date(a.tanggal_selesai).toLocaleDateString('id-ID')}` : ''}</td>
                <td>{a.waktu ? a.waktu.substring(0,5) : '-'}</td>
                <td>{a.lokasi || '-'}</td>
                <td>
                  <button onClick={() => openForm(a)} className="btn" style={{ background: '#f39c12', color: '#fff', padding: '4px 10px', fontSize: 12, marginRight: 5 }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '4px 10px', fontSize: 12 }}>
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
