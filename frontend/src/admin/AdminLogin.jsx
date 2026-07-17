import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a5276, #2980b9)' }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: 400, maxWidth: '90%' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <i className="fas fa-school" style={{ fontSize: 48, color: 'var(--primary)' }}></i>
          <h2 style={{ marginTop: 10, color: 'var(--primary)' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-light)', fontSize: 14 }}>SD Negeri 004 Tenggarong</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" value={form.username}
              onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12, fontSize: 16 }} disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Memproses...</> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
