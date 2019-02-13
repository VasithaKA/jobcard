const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

require('../../models/relationships/Solve');
const Solve = mongoose.model('solves');

require('../../models/relationships/JobFault');
const JobFault = mongoose.model('jobFaults');

require('../../models/Job');
const Job = mongoose.model('jobs');

require('../../models/relationships/AssignTechnician');
const AssignTechnician = mongoose.model('assignTechnicians');

//set Job Fault
router.post('/', async (req, res) => {
    const existingJobFault = await Solve.findOne({ jobId: req.body.jobId, technicianId: req.body.technicianId })

    if (existingJobFault) {
        res.json({
            success: false,
            message: "Already set job"
        })
        return
    }
    const solve = new Solve({
        jobId: req.body.jobId,
        technicianId: req.body.technicianId,
        startTime: moment().format(),
        endTime: req.body.endtTime,
        year: moment().format('YYYY'),
        month: moment().format('MM'),
        mark: req.body.mark
    })
    await solve.save()
        .then(() => res.json({
            success: true,
            message: "Set job!"
        })
        )
})

//get completed Jobs are done by spec. Technician
// router.get('/:technicianId', async (req, res) => {
//     const completedJobs = await Solve.find({technicianId: req.params.technicianId, status:"complete"}).populate('jobId')
//     res.json({
//         completedJobs: completedJobs
//     })
// })

//complete the job
router.patch('/setComplete/:jobId', async (req, res) => {
    await Solve.findOneAndUpdate({ jobId: req.params.jobId }, { $set: { status: "complete", endTime: moment().format()} })
        .then(() => {
            res.json({
                success: "success"
            })
        })
})

//get completed Jobs 
router.get('/complete', async (req, res) => {
    const completedJobs = await Solve.find({status:"complete"},{jobId:1, _id:0})
    var faultsInAJobs = []
    if (completedJobs) {
        for (let j = 0; j < completedJobs.length; j++) {
            const faultsInAJob = await JobFault.find({jobId: completedJobs[j].jobId}).populate({ path: 'jobId', populate: { path: 'machineId', populate: { path: 'departmentId' } } }).populate({ path: 'faultId', populate: { path: 'faultCategoryId' } })
            for (let i = 0; i < faultsInAJob.length; i++) {
                faultsInAJobs.push( { _id:faultsInAJob[i].jobId._id, jobId: faultsInAJob[i].jobId.jobId, date: faultsInAJob[i].jobId.date, description: faultsInAJob[i].jobId.description, faultImage: faultsInAJob[i].jobId.faultImage,serialNumber: faultsInAJob[i].jobId.machineId.serialNumber, departmentName: faultsInAJob[i].jobId.machineId.departmentId.departmentName, faultName:faultsInAJob[i].faultId.faultName, faultCategoryName:faultsInAJob[i].faultId.faultCategoryId.faultCategoryName} )
            }
        }
    }
    res.json({
        completedJobsDetails: faultsInAJobs
    })
})

//get today completed Jobs 
router.get('/todayComplete', async (req, res) => {
    var start = moment().startOf('day');
    var end = moment().endOf('day');
    const todayJobs = await Job.find({date: {$gte: start, $lt: end}},{_id:1})
    var todayCompleteJobs = []
    var todayIncompleteJobs = []
    for (let i = 0; i < todayJobs.length; i++) {
        const completedJobsToday = await Solve.findOne({jobId: todayJobs[i]._id, status:"complete"},{jobId:1,_id:0})
        const incompletedJobsToday = await Solve.findOne({jobId: todayJobs[i]._id, status:"incomplete"},{jobId:1,_id:0})
        if (completedJobsToday) {
            todayCompleteJobs.push(completedJobsToday)
        }
        if (incompletedJobsToday) {
            todayIncompleteJobs.push(incompletedJobsToday)
        }
    }
    const allJobs = await Job.find({}, { _id: 1 })
    var pendingJobs = [];
    for (let i = 0; i < allJobs.length; i++) {
        const assignTechnicians = await AssignTechnician.findOne({ jobId: allJobs[i]._id })
        if (!assignTechnicians) {
            const pendingJob = await Job.findById(allJobs[i]._id, { _id: 1 })
            pendingJobs.push(pendingJob)
        }
    }
    res.json({
        todayAllJobs: pendingJobs.length,
        todayCompletedJobs: todayCompleteJobs.length,
        todayIncompletedJobs: todayIncompleteJobs.length,
        todayPendingJobs: todayJobs.length
    })
})

//get incompleted Jobs 
router.get('/incomplete', async (req, res) => {
    const incompletedJobs = await Solve.find({status:"incomplete"},{jobId:1, _id:0})
    var faultsInAJobs = []
    if (incompletedJobs) {
        for (let j = 0; j < incompletedJobs.length; j++) {
            const faultsInAJob = await JobFault.find({jobId: incompletedJobs[j].jobId}).populate({ path: 'jobId', populate: { path: 'machineId', populate: { path: 'departmentId' } } }).populate({ path: 'faultId', populate: { path: 'faultCategoryId' } })
            for (let i = 0; i < faultsInAJob.length; i++) {
                faultsInAJobs.push( { _id:faultsInAJob[i].jobId._id, jobId: faultsInAJob[i].jobId.jobId, date: faultsInAJob[i].jobId.date, description: faultsInAJob[i].jobId.description, faultImage: faultsInAJob[i].jobId.faultImage,serialNumber: faultsInAJob[i].jobId.machineId.serialNumber, departmentName: faultsInAJob[i].jobId.machineId.departmentId.departmentName, faultName:faultsInAJob[i].faultId.faultName, faultCategoryName:faultsInAJob[i].faultId.faultCategoryId.faultCategoryName} )
            }
        }
    }
    res.json({
        incompletedJobsDetails: faultsInAJobs
    })
})

//get today incompleted Jobs 
router.get('/todayIncomplete', async (req, res) => {
    var start = moment().startOf('day');
    var end = moment().endOf('day');
    const todayJobs = await Job.find({date: {$gte: start, $lt: end}},{_id:1})

    var faultsInAJobs = []
    for (let i = 0; i < todayJobs.length; i++) {
        const completedJobsToday = await Solve.findOne({jobId: todayJobs[i]._id, status:"incomplete"},{jobId:1,_id:0})
        if (completedJobsToday) {
        const faultDetails = await JobFault.findOne({jobId: completedJobsToday.jobId}).populate({ path: 'jobId', populate: { path: 'machineId', populate: { path: 'departmentId' } } }).populate({ path: 'faultId', populate: { path: 'faultCategoryId' } })
            faultsInAJobs.push(faultDetails)
        }
    }
    res.json({
        todayIncompletedJobsDetails: faultsInAJobs
    })
})



  //get job details of a machine without uning an array
  router.get('/job/:technicianId/:year/:status', function(req, res) {
    console.log('Get a job details');
    Solve.find({"technicianId":req.params.technicianId, "year":req.params.year,"status":req.params.status}) 
    
    //.populate(job)
    .exec(function(err,solve){
        console.log("technicianId")
        if(err){
            console.log(err);
        } else {
           var tempArr = [0,0,0,0,0,0,0,0,0,0,0,0]
            solve.forEach(element => {
                //console.log("technicianId")
                var tempDate = new Date(element.endTime) 
               //console.log(tempDate.getMonth());
               //if(solve.status==='complete')
                tempArr[tempDate.getMonth()] +=1;
            });
            res.json({
                //jobs : job,
                data : tempArr
            }); 
        }
    });
  });

//get completed Jobs are done by spec. Technician
router.get('/:technicianId', async (req, res) => {
    console.log('here')
   var complete;
   var incomplete;
console.log(req.params.technicianId)
    Solve.find({ technicianId: req.params.technicianId ,status:"complete"},
        (err, result) => {
            if (!result) {
                // return res.status(404).json({ status: false, message: 'User record not found.' });
                console.log('err')
            }
            else {
                Solve.find({ technicianId: req.params.technicianId ,status:"incomplete"},
                (err, resultin) => {
                    if (!resultin) {
                        // return res.status(404).json({ status: false, message: 'User record not found.' });
                        console.log('err')
                    }
                    else {
                        //incomplete=result.length
                        let rate=result.length/(result.length+resultin.length)*100;
                        return res.json({ status: true,rate:Math.round(rate * 100) / 100});
                    }
                }
            );
            }
        }
    );
    
    console.log(complete)
    
})

module.exports = router;