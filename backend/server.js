const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const beritaRoutes = require('./routes/berita');
const guruRoutes = require('./routes/guru');
const prestasiRoutes = require('./routes/prestasi');
const galeriRoutes = require('./routes/galeri');
const agendaRoutes = require('./routes/agenda');
const profilRoutes = require('./routes/profil');
const ppdbRoutes = require('./routes/ppdb');
const kontakRoutes = require('./routes/kontak');
const statistikRoutes = require('./routes/statistik');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// CORS configuration for Vercel deployment
const corsOptions = {
  origin: [
    'https://sdn004tenggarong.com',
    'https://www.sdn004tenggarong.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/prestasi', prestasiRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/ppdb', ppdbRoutes);
app.use('/api/kontak', kontakRoutes);
app.use('/api/statistik', statistikRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ message: err.message });
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
