const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kontak LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { alamat, nomor_telepon, email, whatsapp, google_maps } = req.body;
    const [rows] = await db.query('SELECT id FROM kontak LIMIT 1');
    if (rows.length) {
      await db.query('UPDATE kontak SET alamat=?, nomor_telepon=?, email=?, whatsapp=?, google_maps=? WHERE id=?',
        [alamat, nomor_telepon, email, whatsapp, google_maps, rows[0].id]);
    } else {
      await db.query('INSERT INTO kontak (alamat, nomor_telepon, email, whatsapp, google_maps) VALUES (?, ?, ?, ?, ?)',
        [alamat, nomor_telepon, email, whatsapp, google_maps]);
    }
    res.json({ message: 'Kontak berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
