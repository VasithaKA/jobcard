const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

require('../../models/relationships/JobFault');
const JobFault = mongoose.model('jobFaults');

require('../../models/relationships/Expertise');
const Expertise = mongoose.model('expertises');

require('../../models/Attend');
const Attend = mongoose.model('attends');

require('../../models/relationships/Solve');
const Solve = mongoose.model('solves');

//set Job Fault
router.post('/', async (req, res) => {
    const existingJobFault = await JobFault.findOne({ jobId: req.body.jobId, faultId: req.body.faultId })

    if (existingJobFault) {
        res.json({
            success: false,
            message: "Already set fault"
        })
        return
    }
    const jobFault = new JobFault({
        jobId: req.body.jobId,
        faultId: req.body.faultId
    })
    await jobFault.save()
        .then(() => res.json({
            success: true,
            message: "Set fault!"
        })
        )
})

//get Faults In A Job
router.get('/fault/:jobId', async (req, res) => {
    const faultsInAJob = await JobFault.find({ jobId: req.params.jobId }).populate({ path: 'jobId', populate: { path: 'machineId', populate: { path: 'departmentId' } } }).populate({ path: 'faultId', populate: { path: 'faultCategoryId' } })
    var faultsInAJobs = []
    for (let i = 0; i < faultsInAJob.length; i++) {
        faultsInAJobs.push({ _id: faultsInAJob[i].jobId._id, jobId: faultsInAJob[i].jobId.jobId, date: faultsInAJob[i].jobId.date, description: faultsInAJob[i].jobId.description, faultImage: faultsInAJob[i].jobId.faultImage, serialNumber: faultsInAJob[i].jobId.machineId.serialNumber, departmentName: faultsInAJob[i].jobId.machineId.departmentId.departmentName, faultName: faultsInAJob[i].faultId.faultName, faultCategoryName: faultsInAJob[i].faultId.faultCategoryId.faultCategoryName })
    }
    res.json({
        faultsInAJobs
    })
})

//get Faults In all Jobs
router.get('/', async (req, res) => {
    const faultsInAJob = await JobFault.find().populate({ path: 'jobId', populate: { path: 'machineId', populate: { path: 'departmentId' } } }).populate({ path: 'faultId', populate: { path: 'faultCategoryId' } })
    var faultsInAJobs = []
    for (let i = 0; i < faultsInAJob.length; i++) {
        faultsInAJobs.push({ _id: faultsInAJob[i].jobId._id, jobId: faultsInAJob[i].jobId.jobId, date: faultsInAJob[i].jobId.date, description: faultsInAJob[i].jobId.description, faultImage: faultsInAJob[i].jobId.faultImage, serialNumber: faultsInAJob[i].jobId.machineId.serialNumber, departmentName: faultsInAJob[i].jobId.machineId.departmentId.departmentName, faultName: faultsInAJob[i].faultId.faultName, faultCategoryName: faultsInAJob[i].faultId.faultCategoryId.faultCategoryName })
    }
    res.json({
        faultsInAJobs
    })
})

//available technicians
router.get('/availableTechnician/:jobId', async (req, res) => {
    const faultCategoryInAjob = await JobFault.findOne({ jobId: req.params.jobId }).populate({ path: 'faultId', populate: { path: 'faultCategoryId' } })
    const expertiseTechnicians = await Expertise.find({ faultCategoryId: faultCategoryInAjob.faultId.faultCategoryId._id }, { technicianId: 1, _id: 0 }).populate('technicianId')
    var availableTechnician = []
    var start = moment().startOf('day');
    var end = moment().endOf('day');
    for (let i = 0; i < expertiseTechnicians.length; i++) {
        const attendTechnician = await Attend.findOne({ technicianId: expertiseTechnicians[i].technicianId._id, date: { $gte: start, $lt: end } }, { technicianId: 1, _id: 0 })
        if (attendTechnician) {
            const Status = await Solve.findOne({ technicianId: attendTechnician.technicianId, status: "incomplete" }, { status: 1, _id: 0 })
            if (!Status) {
                availableTechnician.push(expertiseTechnicians[i])
            }
        }
    }
    res.json({
        availableTechnician
    })
})


//get Faults In A Job
router.get('/jobs/:jobId', function (req, res) {
    console.log('Get all job details');
    JobFault.find({ jobId: req.params.jobId })
        .populate('faultId')
        .exec(function (err, jobFaults) {
            if (err) {
                console.log("Error");
            } else {
                res.json(jobFaults);
            }
        });
});

module.exports = router;