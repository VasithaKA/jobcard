const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Fault');
const Fault = mongoose.model('faults');

//check Fault Category Name is taken
router.get('/check/:faultName', async (req, res) => {
    const unique = await Fault.findOne({ faultName: req.params.faultName })
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

//add Fault
router.post('/', async (req, res) => {
    const existingfault = await Fault.findOne({ faultName: req.body.faultName })

    if (existingfault) {
        res.json({
            success: false,
            message: "Fault name already in use"
        })
        return
    }

    const fault = new Fault({
        faultName: req.body.faultName,
        faultDescription: req.body.faultDescription,
        faultCategoryId: req.body.faultCategoryId
    })

    await fault.save()
    //console.log(result)
    res.json({
        success: true,
        message: "Fault is Registered!"
    })
})

//get one Fault Details
router.get('/:_id', async (req, res) => {
    const aFaultDelails = await Fault.findById(req.params._id).populate('faultCategoryId')
    res.json({
        faultDetails: aFaultDelails
    })
})

//get all Fault Details
router.get('/', async (req, res) => {
    const faultDelails = await Fault.find().populate('faultCategoryId')
    res.json({
        details: faultDelails
    })
})

//Update Fault details
router.patch('/:_id', async (req, res) => {
    const thisFault = await Fault.findOne({ faultName: req.body.faultName })
    const existingFault = await Fault.findOne({ _id: req.params._id, faultName: req.body.faultName })

    if (!existingFault && thisFault) {
        res.json({
            success: false,
            message: "Fault Name already in use. Please enter another one"
        })
        return
    }

    await Fault.findByIdAndUpdate(req.params._id, { $set: { faultName: req.body.faultName, faultDescription: req.body.faultDescription, faultCategoryId: req.body.faultCategoryId } })
        .then(() => {
            res.json({
                success: true,
                message: "Your data is Updated!"
            })
        })

})

//Delete Fault
router.delete('/:_id', async (req, res) => {
    await Fault.findByIdAndDelete(req.params._id)
        .then(() => {
            res.json({
                success: true
            })
        })
})

module.exports = router;