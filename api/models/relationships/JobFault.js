const mongoose = require('mongoose');

const JobFaultSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true },
    faultId: { type: mongoose.Schema.Types.ObjectId, ref: 'faults', required: true }
});

mongoose.model('jobFaults', JobFaultSchema);