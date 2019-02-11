const mongoose = require('mongoose');

const AssignTechnicianSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true },
    date: { type: Date, required:true },
    year: { type: String, required: false},
    month: { type: String, required: false},
    accept: { type: Boolean, default: false}
});

mongoose.model('assignTechnicians', AssignTechnicianSchema);