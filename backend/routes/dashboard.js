const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [totalBerita] = await db.query('SELECT COUNT(*) as total FROM berita');
    const [totalGuru] = await db.query('SELECT COUNT(*) as total FROM guru');
    const [totalPrestasi] = await db.query('SELECT COUNT(*) as total FROM prestasi');
    const [totalAlbum] = await db.query('SELECT COUNT(*) as total FROM album');
    const [totalAgenda] = await db.query('SELECT COUNT(*) as total FROM agenda');
    const [beritaBaru] = await db.query('SELECT b.*, k.nama as kategori FROM berita b LEFT JOIN kategori_berita k ON b.kategori_id = k.id ORDER BY b.created_at DESC LIMIT 5');
    res.json({
      totalBerita: totalBerita[0].total,
      totalGuru: totalGuru[0].total,
      totalPrestasi: totalPrestasi[0].total,
      totalAlbum: totalAlbum[0].total,
      totalAgenda: totalAgenda[0].total,
      beritaBaru
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
