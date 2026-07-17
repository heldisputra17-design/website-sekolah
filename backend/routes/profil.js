const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/:jenis', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM profil_sekolah WHERE jenis = ?', [req.params.jenis]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:jenis', auth, upload.single('foto'), async (req, res) => {
  try {
    const { konten } = req.body;
    await db.query(
      'UPDATE profil_sekolah SET konten=?, foto=COALESCE(?,foto) WHERE jenis=?',
      [konten, req.file ? req.file.filename : null, req.params.jenis]
    );
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
