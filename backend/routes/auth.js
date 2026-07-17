const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.status(401).json({ message: 'Username tidak ditemukan' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, nama: user.nama_lengkap, role: user.role, foto: user.foto } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, nama_lengkap, role, foto FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/profile', auth, upload.single('foto'), async (req, res) => {
  try {
    const { nama_lengkap, email } = req.body;
    let foto = undefined;
    if (req.file) foto = req.file.filename;
    let sql = 'UPDATE users SET nama_lengkap = ?, email = ?';
    const params = [nama_lengkap, email];
    if (foto) { sql += ', foto = ?'; params.push(foto); }
    sql += ' WHERE id = ?';
    params.push(req.user.id);
    await db.query(sql, params);
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/password', auth, async (req, res) => {
  try {
    const { password_lama, password_baru } = req.body;
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(password_lama, rows[0].password);
    if (!valid) return res.status(400).json({ message: 'Password lama salah' });
    const hash = await bcrypt.hash(password_baru, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, nama_lengkap, role, foto FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/users', auth, async (req, res) => {
  try {
    const { username, email, password, nama_lengkap, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, email, password, nama_lengkap, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hash, nama_lengkap, role || 'operator']);
    res.json({ message: 'User berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id', auth, async (req, res) => {
  try {
    const { username, email, password, nama_lengkap, role } = req.body;
    let sql = 'UPDATE users SET username=?, email=?, nama_lengkap=?, role=?';
    const params = [username, email, nama_lengkap, role];
    if (password) { const hash = await bcrypt.hash(password, 10); sql += ', password=?'; params.push(hash); }
    params.push(req.params.id);
    sql += ' WHERE id=?';
    await db.query(sql, params);
    res.json({ message: 'User berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
