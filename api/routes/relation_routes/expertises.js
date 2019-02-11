const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/relationships/Expertise');
const Expertise = mongoose.model('expertises');

require('../../models/Job');
const Job = mongoose.model('jobs');

//set Technician for Fault Category
router.post('/', async (req, res) => {
    const existingAssignTechnician = await AssignTechnician.findOne({ jobId: req.body.jobId, technicianId: req.body.technicianId })

    if (existingAssignTechnician) {
        res.json({
            success: false,
            message: "Technician Assign already"
        })
        return
    }
    const assignTechnician = new AssignTechnician({
        jobId: req.body.jobId,
        technicianId: req.body.technicianId
    })
    await assignTechnician.save()
        .then(() => res.json({
            success: true,
            message: "Technician Assigned!"
        })
        )
})