const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

require('../../models/relationships/AssignTechnician');
const AssignTechnician = mongoose.model('assignTechnicians');

require('../../models/Job');
const Job = mongoose.model('jobs');

require('../../models/relationships/JobFault');
const JobFault = mongoose.model('jobFaults');

require('../../models/relationships/Solve');
const Solve = mongoose.model('solves');

//set Assign Technician
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
        technicianId: req.body.technicianId,
        date: moment().format(),
        year: moment().format('YYYY'),
        month: moment().format('MM'),
    })
    await assignTechnician.save()
        .then(() => res.json({
            success: true,
            message: "Technician Assigned!"
        })
        )
})

//accept the job
router.post('/accept', async (req, res) => {
    await AssignTechnician.findOneAndUpdate({ jobId: req.body.jobId }, { $set: { accept: req.body.accept } })
    .then(() => {
        const solve = new Solve({
            jobId: req.body.jobId,
            technicianId: req.body.technicianId,
            startTime: moment().format(),
            endTime: req.body.endtTime,
            year: moment().format('YYYY'),
            month: moment().format('MM'),
            mark: req.body.mark
        })
        solve.save()
        .then(() => res.json({
            success: true,
            message: "Set job!"
        })
        )
    })
})

//get Assign job Details
router.get('/technician/:technicianId', async (req, res) => {
    const assignTechnicianJobs = await AssignTechnician.find({ technicianId: req.params.technicianId },{jobId:1, date:1, accept:1, _id:0})
    var jobToDo = []
    for (let i = 0; i < assignTechnicianJobs.length; i++) {
        const jobs = await JobFault.findOne({jobId: assignTechnicianJobs[i].jobId}).populate({ path: 'jobId', populate: { path: 'machineId', populate: { path: 'departmentId' } } }).populate({ path: 'faultId', populate: { path: 'faultCategoryId' } })
        jobToDo.push({jobs, solvedetails: {date:assignTechnicianJobs[i].date,accept:assignTechnicianJobs[i].accept}})
    }

    res.json({
        assignTechnicianJobs: jobToDo
    })
})

//get Assign Technician in a job
router.get('/job/:jobId', async (req, res) => {
    const assignTechnicians = await AssignTechnician.find({ jobId: req.params.jobId }).populate('technicianId')
    if (assignTechnicians) {
        res.json({
            assignTechnicians: assignTechnicians
        })
    } else {
        res.json({
            status: "Pending"
        })
    }
})

//Not accept job
router.get('/notAccept', async (req, res) => {
    const notAcceptJobs = await AssignTechnician.find({ accept: false }).populate('technicianId').populate('jobId')
    res.json({
        notAcceptJobs
    })
})

//pending jobs
router.get('/pending', async (req, res) => {
    const allJobs = await Job.find({}, { _id: 1 })
    var pendingJobs = [];
    for (let i = 0; i < allJobs.length; i++) {
        const assignTechnicians = await AssignTechnician.findOne({ jobId: allJobs[i]._id })
        if (!assignTechnicians) {
            const pendingJob = await Job.findById(allJobs[i]._id, { _id: 1 })
            pendingJobs.push(pendingJob)
        }
    }
    var faultsInAJobs = []
    for (let j = 0; j < pendingJobs.length; j++) {
        const faultsInAJob = await JobFault.find({ jobId: pendingJobs[j]._id }).populate({ path: 'jobId', populate: { path: 'machineId', populate: { path: 'departmentId' } } }).populate({ path: 'faultId', populate: { path: 'faultCategoryId' } })
        for (let i = 0; i < faultsInAJob.length; i++) {
            faultsInAJobs.push({ _id: faultsInAJob[i].jobId._id, jobId: faultsInAJob[i].jobId.jobId, date: faultsInAJob[i].jobId.date, description: faultsInAJob[i].jobId.description, faultImage: faultsInAJob[i].jobId.faultImage, serialNumber: faultsInAJob[i].jobId.machineId.serialNumber, departmentName: faultsInAJob[i].jobId.machineId.departmentId.departmentName, faultName: faultsInAJob[i].faultId.faultName, faultCategoryName: faultsInAJob[i].faultId.faultCategoryId.faultCategoryName })
            // }
            // res.json({
            //     pendingJobsDetails: faultsInAJobs
            // })
        }
    }
    res.json({
        pendingJobs: faultsInAJobs
    })
})



//get job details of a machine without uning an array
router.get('/jobs/:technicianId/:year', function (req, res) {
    console.log('Get a job details');
    AssignTechnician.find({ "technicianId": req.params.technicianId, "year": req.params.year })
        //.populate(job)
        .exec(function (err, assignTechnician) {
            if (err) {
                console.log("Error");
            } else {
                var tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                assignTechnician.forEach(element => {
                    var tempDate = new Date(element.date)
                    // console.log(tempDate.getMonth());
                    tempArr[tempDate.getMonth()] += 1;
                });
                res.json({
                    //jobs : job,
                    data: tempArr
                });
            }
        });
});

module.exports = router;