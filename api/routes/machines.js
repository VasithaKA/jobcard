const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Machine');
const Machine = mongoose.model('machines');

//Register machine
router.post('/', async (req, res) => {
    const existingMach = await Machine.findOne({ serialNumber: req.body.serialNumber })

    if (existingMach) {
        res.json({
            success: false,
            message: "Machine ID already in use"
        })
        return
    }
    const machine = new Machine({
        serialNumber: req.body.serialNumber,
        location: req.body.location,
        supervisorId: req.body.supervisorId,
        departmentId: req.body.departmentId
    })

    await machine.save()
    res.json({
        success: true,
        message: "Machine is Registered!"
    })

})

//get all machine details
router.get('/', async (req, res) => {
    const machDetails = await Machine.find().populate('departmentId')
    res.json({
        details: machDetails
    })
})

//get a machine details
router.get('/:_id', async (req, res) => {
    const machDetails = await Machine.findById(req.params._id).populate('departmentId').populate('supervisorId')
    res.json({
        details: machDetails
    })
})

//get a machine details
router.post('/check/serialNumber', async (req, res) => {
    const machDetails = await Machine.findOne({ serialNumber: req.body.serialNumber }).populate('departmentId')
    res.json({
        unique: machDetails
    })
})

//check serialNumber is taken
router.get('/check/:serialNumber', async (req, res) => {
    const unique = await Machine.findOne({ serialNumber: req.params.serialNumber })
    if (unique) {
        res.json({
            unique: true
        })
    } else {
        res.json({
            unique: false
        })
    }
})

//get job details in a machine
router.get('/job/', async (req, res) => {
    const machDetails = await Machine.aggregate([
        { $lookup:
           {
             from: 'jobs',
             localField: '_id',
             foreignField: 'machineId',
             as: 'jobdetails'
           }
         }
        ])
    res.json({
        details: machDetails
    })
})

//Update machine details
router.patch('/:_id', async (req, res) => {
    await Machine.findByIdAndUpdate(req.params._id, { $set: { serialNumber: req.body.serialNumber, location: req.body.location, departmentId: req.body.departmentId, supervisorId: req.body.supervisorId } })
        .then(() => {
            res.json({
                success: true,
                message: "Your data is Updated!"
            })
        })
})


//get machine details without array
router.get('/machines/machines', function(req, res) {
    console.log('Get all machine details');
    Machine.find({}) 
    .populate('departmentId')
    .exec(function(err,machines){
        if(err){
            console.log("Error");
        } else {
            res.json(machines);
        }
    });
  });

  //get a machine details without array
router.get('/machines/machines/:_id', function(req, res) {
    console.log('Get a machine details');
    Machine.findById(req.params._id) 
    .populate('departmentId')
    .exec(function(err,machine){
        if(err){
            console.log("Error");
        } else {
            res.json(machine);
        }
    });
  });


module.exports = router;