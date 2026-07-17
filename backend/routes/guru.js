const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM guru WHERE tampil_di_website = 1 ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM guru ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM guru WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Guru tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, upload.single('foto'), async (req, res) => {
  try {
    const { nama, nip, jabatan, mapel, pendidikan, status_kepegawaian } = req.body;
    const foto = req.file ? req.file.filename : null;
    const [result] = await db.query(
      'INSERT INTO guru (nama, nip, jabatan, mapel, foto, pendidikan, status_kepegawaian) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nama, nip, jabatan, mapel, foto, pendidikan, status_kepegawaian || 'Honorer']
    );
    res.json({ id: result.insertId, message: 'Guru berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, upload.single('foto'), async (req, res) => {
  try {
    const { nama, nip, jabatan, mapel, pendidikan, status_kepegawaian, tampil_di_website } = req.body;
    await db.query(
      'UPDATE guru SET nama=?, nip=?, jabatan=?, mapel=?, foto=COALESCE(?,foto), pendidikan=?, status_kepegawaian=?, tampil_di_website=? WHERE id=?',
      [nama, nip, jabatan, mapel, req.file ? req.file.filename : null, pendidikan, status_kepegawaian, tampil_di_website, req.params.id]
    );
    res.json({ message: 'Guru berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM guru WHERE id = ?', [req.params.id]);
    res.json({ message: 'Guru berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
