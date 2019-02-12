const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

require('../models/Attend');
const Attend = mongoose.model('attends');

//add to Attend Technician
router.post('/', async (req, res) => {
    var start = moment().startOf('day');
    var end = moment().endOf('day');
    const todayAttend = await Attend.findOne({technicianId: req.body.technicianId, date: {$gte: start, $lt: end}})
    if (todayAttend) {
        const attend = new Attend({
            date: moment().format(),
            technicianId: req.body.technicianId
        })
        await attend.save()
            .then(() => res.json({
                success: true,
                message: "Attend register!"
            })
            )
    } else {
        res.json({
            success: false,
            message: "Attend already register!"
        })
    }

})

//get all Attend Technician
router.get('/', async (req, res) => {
    var start = moment().startOf('day');
    var end = moment().endOf('day');
    const attendTechnician = await Attend.find({date: {$gte: start, $lt: end}}).populate('technicianId')
    res.json({
        attendTechnician: attendTechnician
    })
})

module.exports = router;