const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM statistik');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { nilai } = req.body;
    await db.query('UPDATE statistik SET nilai = ? WHERE id = ?', [nilai, req.params.id]);
    res.json({ message: 'Statistik berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
