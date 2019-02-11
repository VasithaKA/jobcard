const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Attend');
const Attend = mongoose.model('attends');

//add to Attend Technician
router.post('/', async (req, res) => {
    const attend = new Attend({
        date: req.body.date,
        technicianId: req.body.technicianId
    })
    await attend.save()
        .then(() => res.json({
            success: true,
            message: "Attend register!"
        })
        )
})

//get all Attend Technician
router.get('/', async (req, res) => {
    const attendTechnician = await Attend.find().populate('technicianId')
    res.json({
        attendTechnician: attendTechnician
    })
})

module.exports = router;