const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/FaultCategory');
const FaultCategory = mongoose.model('faultcategories');

require('../models/Fault');
const Fault = mongoose.model('faults');

//check Fault Category Name is taken
router.get('/check/:faultCategoryName', async (req, res) => {
    const unique = await FaultCategory.findOne({ faultCategoryName: req.params.faultCategoryName })
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

//add Fault Category
router.post('/', async (req, res) => {
    const existingcategory = await FaultCategory.findOne({ faultCategoryName: req.body.faultCategoryName })

    if (existingcategory) {
        res.json({
            success: false,
            message: "category ID already in use"
        })
        return
    }
    const faultCategory = new FaultCategory({
        faultCategoryName: req.body.faultCategoryName
    })

    await faultCategory.save()
    //console.log(result)
    res.json({
        success: true,
        message: "Fault Category Name is Registered!"
    })
})

//get one Fault Category Details
router.get('/:_id', async (req, res) => {
    const aFaultCategoryDelails = await FaultCategory.findById(req.params._id)
    res.json({
        faultCategoryDetails: aFaultCategoryDelails
    })
})

//get all Fault Category Details
router.get('/', async (req, res) => {
    const faultCategoryDelails = await FaultCategory.find()
    res.json({
        details: faultCategoryDelails
    })
})

//Update Fault Category details
router.patch('/:_id', async (req, res) => {
    const thisFaultCategory = await FaultCategory.findOne({ faultCategoryName: req.body.faultCategoryName })
    const existingFaultCategory = await FaultCategory.findOne({ _id: req.params._id, faultCategoryName: req.body.faultCategoryName })

    if (!existingFaultCategory && thisFaultCategory) {
        res.json({
            success: false,
            message: "Category Name already in use. Please enter another one"
        })
        return
    }

    await FaultCategory.findByIdAndUpdate(req.params._id, { $set: { faultCategoryName: req.body.faultCategoryName } })
        .then(() => {
            res.json({
                success: true,
                message: "Your data is Updated!"
            })
        })

})

//Delete Fault Category type
router.delete('/:_id', async (req, res) => {
    const isAnyFault = await Fault.findOne({ faultCategoryId: req.params._id })
    if (isAnyFault) {
        res.json({
            success: false,
            message: "Can not Delete, Category is taken as foreign key"
        })
        return
    } else {
        await FaultCategory.findByIdAndDelete(req.params._id)
            .then(() => {
                res.json({
                    success: true
                })
            })
    }
})

module.exports = router;