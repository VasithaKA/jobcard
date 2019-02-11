const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Department');
const Department = mongoose.model('departments');

require('../models/Employee');
const Employee = mongoose.model('employees');

require('../models/Machine');
const Machine = mongoose.model('machines');

//check department name is taken
router.get('/check/:departmentName', async (req, res) => {
    const unique = await Department.findOne({ departmentName: req.params.departmentName })
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

//add department
router.post('/', async (req, res) => {
    const existingDepartment = await Department.findOne({ departmentName: req.body.departmentName })

    if (existingDepartment) {
        res.json({
            success: false,
            message: "Department Name already in use"
        })
        return
    }
    const department = new Department({
        departmentName: req.body.departmentName
    })

    await department.save()
    res.json({
        success: true,
        message: "Department Name is Registered!"
    })
})

//get one userType Details
router.get('/:_id', async (req, res) => {
    const aDepartmentNameDetails = await Department.findById(req.params._id)
    res.json({
        departmentDetails: aDepartmentNameDetails
    })
})

//get all userType Details
router.get('/', async (req, res) => {
    const departmentNameDetails = await Department.find()
    res.status(200).json({
        details: departmentNameDetails
    })
})

//Update userType details
router.patch('/:_id', async (req, res) => {
    const thisDepartment = await Department.findOne({ departmentName: req.body.departmentName })
    const existingDepartment = await Department.findOne({ _id: req.params._id, departmentName: req.body.departmentName })

    if (!existingDepartment && thisDepartment) {
        res.json({
            success: false,
            message: "Department Name already in use. Please enter another one"
        })
        return
    }

    await Department.findByIdAndUpdate(req.params._id, { $set: { departmentName: req.body.departmentName } })
        .then(() => {
            res.json({
                success: true,
                message: "Your data is Updated!"
            })
        })

})

//Delete Department
router.delete('/:_id', async (req, res) => {
    const isAnyEmployee = await Employee.findOne({ departmentId: req.params._id })
    const isAnyMachine = await Machine.findOne({ departmentId: req.params._id })
    if (isAnyEmployee || isAnyMachine) {
        res.json({
            success: false,
            message: "Can not Delete"
        })
        return
    } else {
        await Department.findByIdAndDelete(req.params._id)
            .then(() => {
                res.json({
                    success: true
                })
            })
    }
})

module.exports = router;