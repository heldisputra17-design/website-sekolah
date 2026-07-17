const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/album', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT a.*, (SELECT COUNT(*) FROM foto WHERE album_id = a.id) as jumlah_foto FROM album a ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/album/:id', async (req, res) => {
  try {
    const [albums] = await db.query('SELECT * FROM album WHERE id = ?', [req.params.id]);
    if (!albums.length) return res.status(404).json({ message: 'Album tidak ditemukan' });
    const [fotos] = await db.query('SELECT * FROM foto WHERE album_id = ? ORDER BY created_at DESC', [req.params.id]);
    res.json({ album: albums[0], foto: fotos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/album', auth, upload.single('cover'), async (req, res) => {
  try {
    const { judul, deskripsi } = req.body;
    const cover = req.file ? req.file.filename : null;
    const [result] = await db.query('INSERT INTO album (judul, deskripsi, cover) VALUES (?, ?, ?)', [judul, deskripsi, cover]);
    res.json({ id: result.insertId, message: 'Album berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/album/:id', auth, upload.single('cover'), async (req, res) => {
  try {
    const { judul, deskripsi } = req.body;
    await db.query(
      'UPDATE album SET judul=?, deskripsi=?, cover=COALESCE(?,cover) WHERE id=?',
      [judul, deskripsi, req.file ? req.file.filename : null, req.params.id]
    );
    res.json({ message: 'Album berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/album/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM album WHERE id = ?', [req.params.id]);
    res.json({ message: 'Album berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/foto', async (req, res) => {
  try {
    const { album_id } = req.query;
    let sql = 'SELECT f.*, a.judul as album_judul FROM foto f JOIN album a ON f.album_id = a.id';
    const params = [];
    if (album_id) { sql += ' WHERE f.album_id = ?'; params.push(album_id); }
    sql += ' ORDER BY f.created_at DESC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/foto', auth, upload.array('foto', 10), async (req, res) => {
  try {
    const { album_id, caption } = req.body;
    if (!req.files || !req.files.length) return res.status(400).json({ message: 'Pilih file foto' });
    for (const file of req.files) {
      await db.query('INSERT INTO foto (album_id, file, caption) VALUES (?, ?, ?)', [album_id, file.filename, caption || '']);
    }
    res.json({ message: 'Foto berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/foto/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM foto WHERE id = ?', [req.params.id]);
    res.json({ message: 'Foto berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/video', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM video ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/video', auth, upload.single('thumbnail'), async (req, res) => {
  try {
    const { judul, url, deskripsi } = req.body;
    const thumbnail = req.file ? req.file.filename : null;
    const [result] = await db.query('INSERT INTO video (judul, url, deskripsi, thumbnail) VALUES (?, ?, ?, ?)',
      [judul, url, deskripsi, thumbnail]);
    res.json({ id: result.insertId, message: 'Video berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/video/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM video WHERE id = ?', [req.params.id]);
    res.json({ message: 'Video berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
