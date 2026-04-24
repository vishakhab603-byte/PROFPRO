// =============================================
// server.js — ProfSync Backend Entry Point
// Works both locally (node server.js) and on
// Vercel (serverless — no persistent process).
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());

// ── DB Connection Cache ─────────────────────
// Vercel spins up a new function instance for each request,
// so we can't rely on a single mongoose.connect() at startup.
// Instead, we cache the connection and reuse it across
// invocations in the same warm instance — this is the
// recommended pattern for serverless + Mongoose.
let isConnected = false;

async function connectDB() {
    if (isConnected) return; // reuse existing connection

    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB: ProfSync');
}

// Run connectDB before every request (no-op when already connected)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('❌ DB connection failed:', err.message);
        res.status(503).json({ message: 'Database unavailable. Try again shortly.' });
    }
});

// ── Routes ──────────────────────────────────
const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/teachers', teacherRoutes);

// Health check — useful for Vercel deploy verification
app.get('/', (req, res) => {
    res.json({
        message: 'ProfSync API is live 🚀',
        version: '1.0.0',
        endpoints: {
            getAllTeachers: 'GET    /api/teachers',
            addTeacher:    'POST   /api/teachers',
            updateTeacher: 'PUT    /api/teachers/:id',
            deleteTeacher: 'DELETE /api/teachers/:id',
        }
    });
});

// ── Export for Vercel ────────────────────────
// Vercel imports this file and handles the HTTP server itself.
// module.exports = app must be present for serverless to work.
module.exports = app;

// ── Local Dev Fallback ───────────────────────
// When you run `node server/server.js` directly (not via Vercel),
// this block starts the HTTP server the traditional way.
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    connectDB()
        .then(() => app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`)))
        .catch(err => {
            console.error('❌ Startup failed:', err.message);
            process.exit(1);
        });
}
