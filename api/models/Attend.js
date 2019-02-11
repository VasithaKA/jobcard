const mongoose = require('mongoose');

const AttendSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true }
});

mongoose.model('attends', AttendSchema);