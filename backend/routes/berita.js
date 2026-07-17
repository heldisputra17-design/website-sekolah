const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
}

router.get('/', async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    let sql = `SELECT b.*, k.nama as kategori 
               FROM berita b LEFT JOIN kategori_berita k ON b.kategori_id = k.id 
               WHERE 1=1`;
    const params = [];
    if (status) { sql += ' AND b.status = ?'; params.push(status); }
    sql += ' ORDER BY b.created_at DESC';
    if (limit) { sql += ' LIMIT ?'; params.push(parseInt(limit)); }
    if (offset) { sql += ' OFFSET ?'; params.push(parseInt(offset)); }
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/kategori', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kategori_berita ORDER BY nama');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT b.*, k.nama as kategori FROM berita b LEFT JOIN kategori_berita k ON b.kategori_id = k.id WHERE b.id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Berita tidak ditemukan' });
    await db.query('UPDATE berita SET views = views + 1 WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT b.*, k.nama as kategori FROM berita b LEFT JOIN kategori_berita k ON b.kategori_id = k.id WHERE b.slug = ?',
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ message: 'Berita tidak ditemukan' });
    await db.query('UPDATE berita SET views = views + 1 WHERE id = ?', [rows[0].id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, upload.single('thumbnail'), async (req, res) => {
  try {
    const { judul, konten, kategori_id, status, penulis } = req.body;
    let slug = slugify(judul);
    const [existing] = await db.query('SELECT id FROM berita WHERE slug = ?', [slug]);
    if (existing.length) slug += '-' + Date.now();
    let thumbnail = null;
    if (req.file) thumbnail = req.file.filename;
    const [result] = await db.query(
      'INSERT INTO berita (judul, slug, konten, thumbnail, kategori_id, penulis, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [judul, slug, konten, thumbnail, kategori_id || null, penulis || 'Admin', status || 'draft']
    );
    res.json({ id: result.insertId, message: 'Berita berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, upload.single('thumbnail'), async (req, res) => {
  try {
    const { judul, konten, kategori_id, status, penulis } = req.body;
    let sql = 'UPDATE berita SET judul=?, konten=?, kategori_id=?, penulis=?, status=?';
    const params = [judul, konten, kategori_id || null, penulis, status];
    if (judul) { params.unshift(slugify(judul)); sql += ', slug=?'; }
    if (req.file) { params.push(req.file.filename); sql += ', thumbnail=?'; }
    params.push(req.params.id);
    sql += ' WHERE id=?';
    // rebuild sql properly
    sql = 'UPDATE berita SET judul=?, konten=?, kategori_id=?, penulis=?, status=?';
    const params2 = [judul, konten, kategori_id || null, penulis || 'Admin', status || 'draft'];
    if (judul) params2.push(slugify(judul) + '-' + Date.now());
    if (req.file) params2.push(req.file.filename);
    params2.push(req.params.id);
    await db.query('UPDATE berita SET judul=?, konten=?, thumbnail=COALESCE(?,thumbnail), kategori_id=?, penulis=?, status=? WHERE id=?',
      [judul, konten, req.file ? req.file.filename : null, kategori_id || null, penulis || 'Admin', status || 'draft', req.params.id]);
    res.json({ message: 'Berita berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM berita WHERE id = ?', [req.params.id]);
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
