// =============================================
// routes/teacherRoutes.js — Teacher API Routes
// Handles all CRUD operations for teachers.
// Mounted at /api/teachers in server.js
// =============================================

const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// ── GET /api/teachers ─────────────────────────
// Fetch all teachers. Supports optional filtering:
//   ?status=Available   → only available teachers
//   ?department=CS      → filter by department
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.status)     filter.currentStatus = req.query.status;
        if (req.query.department) filter.department    = req.query.department;

        const teachers = await Teacher.find(filter).sort({ name: 1 });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch teachers', error: err.message });
    }
});

// ── GET /api/teachers/:id ─────────────────────
// Fetch a single teacher by their MongoDB ID
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch teacher', error: err.message });
    }
});

// ── POST /api/teachers ────────────────────────
// Add a new teacher
// Body: { name, subject, department, currentStatus }
router.post('/', async (req, res) => {
    try {
        const { name, subject, department, currentStatus } = req.body;

        if (!name) return res.status(400).json({ message: 'Name is required' });

        const newTeacher = new Teacher({ name, subject, department, currentStatus });
        const saved = await newTeacher.save();

        res.status(201).json(saved);
    } catch (err) {
        // Mongoose validation errors (e.g. bad status value) land here
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Failed to add teacher', error: err.message });
    }
});

// ── PUT /api/teachers/:id ─────────────────────
// Update an existing teacher's details
// Body: any subset of { name, subject, department, currentStatus }
router.put('/:id', async (req, res) => {
    try {
        const { name, subject, department, currentStatus } = req.body;

        const updated = await Teacher.findByIdAndUpdate(
            req.params.id,
            { name, subject, department, currentStatus },
            {
                new: true,        // return the updated doc, not the old one
                runValidators: true, // still enforce schema validation on update
            }
        );

        if (!updated) return res.status(404).json({ message: 'Teacher not found' });
        res.json(updated);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Failed to update teacher', error: err.message });
    }
});

// ── DELETE /api/teachers/:id ──────────────────
// Remove a teacher from the database
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Teacher.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Teacher not found' });

        res.json({ message: `${deleted.name} has been removed.` });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete teacher', error: err.message });
    }
});

module.exports = router;
