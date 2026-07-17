const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ppdb ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/files', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ppdb_file ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { judul, konten, jenis } = req.body;
    const [result] = await db.query('INSERT INTO ppdb (judul, konten, jenis) VALUES (?, ?, ?)', [judul, konten, jenis]);
    res.json({ id: result.insertId, message: 'PPDB berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { judul, konten, jenis } = req.body;
    await db.query('UPDATE ppdb SET judul=?, konten=?, jenis=? WHERE id=?', [judul, konten, jenis, req.params.id]);
    res.json({ message: 'PPDB berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM ppdb WHERE id = ?', [req.params.id]);
    res.json({ message: 'PPDB berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { ppdb_id, nama_file } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Pilih file' });
    await db.query('INSERT INTO ppdb_file (ppdb_id, nama_file, file) VALUES (?, ?, ?)',
      [ppdb_id, nama_file || req.file.originalname, req.file.filename]);
    res.json({ message: 'File berhasil diupload' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/file/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM ppdb_file WHERE id = ?', [req.params.id]);
    res.json({ message: 'File berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
