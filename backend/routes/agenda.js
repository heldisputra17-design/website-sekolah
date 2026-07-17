const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM agenda WHERE tanggal_mulai >= CURDATE() ORDER BY tanggal_mulai ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM agenda ORDER BY tanggal_mulai DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM agenda WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Agenda tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { judul, deskripsi, tanggal_mulai, tanggal_selesai, waktu, lokasi } = req.body;
    const [result] = await db.query(
      'INSERT INTO agenda (judul, deskripsi, tanggal_mulai, tanggal_selesai, waktu, lokasi) VALUES (?, ?, ?, ?, ?, ?)',
      [judul, deskripsi, tanggal_mulai, tanggal_selesai || tanggal_mulai, waktu, lokasi]
    );
    res.json({ id: result.insertId, message: 'Agenda berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { judul, deskripsi, tanggal_mulai, tanggal_selesai, waktu, lokasi } = req.body;
    await db.query(
      'UPDATE agenda SET judul=?, deskripsi=?, tanggal_mulai=?, tanggal_selesai=?, waktu=?, lokasi=? WHERE id=?',
      [judul, deskripsi, tanggal_mulai, tanggal_selesai, waktu, lokasi, req.params.id]
    );
    res.json({ message: 'Agenda berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM agenda WHERE id = ?', [req.params.id]);
    res.json({ message: 'Agenda berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
