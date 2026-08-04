require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./src/db');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(s => s.trim()) }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', require('./src/routes/auth')(db));
app.use('/api/reports', require('./src/routes/reports')(db));
app.use('/api/alerts', require('./src/routes/alerts')(db));

// 404 for anything else under /api
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// Generic error handler (e.g. malformed JSON body)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed request body.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`HydroGuard API listening on http://localhost:${PORT}/api`);
});
