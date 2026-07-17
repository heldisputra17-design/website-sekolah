import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AdminUser() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', nama_lengkap: '', role: 'operator' });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    api.get('/auth/users').then(r => setList(r.data)).catch(() => {});
  };

  const openForm = (item) => {
    if (item) {
      setEdit(item);
      setForm({ username: item.username, email: item.email, password: '', nama_lengkap: item.nama_lengkap || '', role: item.role });
    } else {
      setEdit(null);
      setForm({ username: '', email: '', password: '', nama_lengkap: '', role: 'operator' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (edit) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await api.put(`/auth/users/${edit.id}`, payload);
      } else {
        await api.post('/auth/users', form);
      }
      loadData(); setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus user?')) return;
    try { await api.delete(`/auth/users/${id}`); loadData(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: 'var(--primary)' }}>Kelola User</h2>
        <button onClick={() => openForm(null)} className="btn btn-primary"><i className="fas fa-plus"></i> Tambah User</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 15 }}>{edit ? 'Edit User' : 'Tambah User'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Password {edit && '(kosongkan jika tidak diubah)'}</label>
                <input type="password" className="form-control" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!edit} />
              </div>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" className="form-control" value={form.nama_lengkap} onChange={e => setForm({...form, nama_lengkap: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="submit" className="btn btn-primary">Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn" style={{ background: '#95a5a6', color: '#fff' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Username</th><th>Email</th><th>Nama</th><th>Role</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {list.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.nama_lengkap || '-'}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-success' : 'badge-info'}`}>{u.role}</span></td>
                <td>
                  <button onClick={() => openForm(u)} className="btn" style={{ background: '#f39c12', color: '#fff', padding: '4px 10px', fontSize: 12, marginRight: 5 }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '4px 10px', fontSize: 12 }}>
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
