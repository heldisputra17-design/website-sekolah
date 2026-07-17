const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM prestasi ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM prestasi WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Prestasi tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, upload.single('foto'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori, prestasi, tanggal } = req.body;
    const foto = req.file ? req.file.filename : null;
    const [result] = await db.query(
      'INSERT INTO prestasi (judul, deskripsi, kategori, prestasi, foto, tanggal) VALUES (?, ?, ?, ?, ?, ?)',
      [judul, deskripsi, kategori || 'Akademik', prestasi, foto, tanggal]
    );
    res.json({ id: result.insertId, message: 'Prestasi berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, upload.single('foto'), async (req, res) => {
  try {
    const { judul, deskripsi, kategori, prestasi, tanggal } = req.body;
    await db.query(
      'UPDATE prestasi SET judul=?, deskripsi=?, kategori=?, prestasi=?, foto=COALESCE(?,foto), tanggal=? WHERE id=?',
      [judul, deskripsi, kategori, prestasi, req.file ? req.file.filename : null, tanggal, req.params.id]
    );
    res.json({ message: 'Prestasi berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM prestasi WHERE id = ?', [req.params.id]);
    res.json({ message: 'Prestasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
