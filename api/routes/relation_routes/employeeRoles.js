const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/relationships/EmployeeRole');
const EmployeeRole = mongoose.model('employeeRoles');

require('../../models/Role');
const Role = mongoose.model('roles');

require('../../models/Employee');
const Employee = mongoose.model('employees');

//set employee role
router.patch('/set/:employeeTypeId', async (req, res) => {

    for (let i = 0; i < req.body.setRoles.length; i++) {
        await EmployeeRole.findOneAndUpdate({ employeeTypeId: req.params.employeeTypeId, roleId: req.body.setRoles[i].roleId._id },{ $set: { status: req.body.setRoles[i].status } })
    }

    res.json({
        success: true,
        message: "Your data is Updated!"
    })
})

//get employee role Details
router.get('/all/:employeeTypeId', async (req, res) => {
    const setRolesForAType = await EmployeeRole.find({employeeTypeId:req.params.employeeTypeId}).populate('roleId')
    res.json({
        setRolesForAType: setRolesForAType
    })
})

//get employee role Details
router.get('/true/:employeeTypeId', async (req, res) => {
    const rolesForAType = await EmployeeRole.find({employeeTypeId: req.params.employeeTypeId, status: true}).populate('roleId', 'roleNumber')
    res.json({
        rolesForAType: rolesForAType
    })
})

//get employee role Details
router.get('/supervisor/', async (req, res) => {
    const roleNo = await Role.findOne({ roleNumber: 5 }, {_id:1})
    const supervisorId = await EmployeeRole.find({roleId: roleNo, status: true}, { employeeTypeId:1 , _id:0})
    const supervisors = []
    for (let i = 0; i < supervisorId.length; i++) {
        const data = await Employee.findOne({employeeTypeId: supervisorId[i].employeeTypeId}, { firstName:1})
        supervisors.push(data)
    }
    res.json({
        supervisors
    })
})

//Update employee role details
// router.patch('/:_id', async (req, res) => {
//     const existingFaultCategory = await EmployeeRole.findOne({ employeeTypeId: req.params.employeeTypeId, roleId: req.body.roleId })

//     if (!existingFaultCategory) {
//         await EmployeeRole.findOne(req.params._id, { $set: { faultCategoryName: req.body.faultCategoryDescription, faultCategoryName: req.body.faultCategoryDescription } })
//     }

//     await FaultCategory.findByIdAndUpdate(req.params._id, { $set: { faultCategoryName: req.body.faultCategoryDescription, faultCategoryName: req.body.faultCategoryDescription } })
//         .then(() => {
//             res.json({
//                 success: true,
//                 message: "Your data is Updated!"
//             })
//         })

// })

module.exports = router;