// =============================================
// models/Teacher.js — Mongoose Schema
// Defines what a "Teacher" document looks like
// in our MongoDB collection.
// =============================================

const mongoose = require('mongoose');

// Valid statuses a teacher can have
const STATUS_OPTIONS = ['Available', 'In Lecture', 'In Meeting', 'On Break', 'Offline'];

const teacherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Teacher name is required'],
            trim: true,
        },
        subject: {
            type: String,
            trim: true,
            default: 'General',
        },
        department: {
            type: String,
            trim: true,
            default: 'General',
        },
        currentStatus: {
            type: String,
            enum: STATUS_OPTIONS,
            default: 'Available',
        },
    },
    {
        // Automatically adds createdAt and updatedAt fields — super useful!
        timestamps: true,
    }
);

module.exports = mongoose.model('Teacher', teacherSchema);
