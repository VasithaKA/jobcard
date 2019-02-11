const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true },
    location: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'departments', required: true },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true }
});

mongoose.model('machines', MachineSchema);