const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


require('../models/Employee');
const Employee = mongoose.model('employees');

require('../models/relationships/EmployeeRole');
const EmployeeRole = mongoose.model('employeeRoles');

//Login
router.post('/', async (req, res) => {
    const resp = await Employee.findOne({ userName: req.body.userName }).populate('employeeTypeId')
    //const resp = await User.findOne({ userName: req.body.userName, password: req.body.password }).populate('employeeTypeId')
    if (!resp) {
        res.json({
            success: false,
            message: "User Name Is Not Found"
        })
        return
    }

    const userRole = await EmployeeRole.find({ employeeTypeId: resp.employeeTypeId, status: true }).populate('roleId', 'roleNumber')

    bcrypt.compare(req.body.password, resp.password, (err, result) => {
        if (err) {
            res.json({
                success: false,
                message: "Incorrect Details"
            })
            return
        }
        if (result) {
            res.json({
                success: true,
                employeeId:resp._id,
                employeeTypeName: resp.employeeTypeId.employeeTypeName
            })
            req.session.user = resp
            req.session.save()
            req.session.userRole = userRole
            req.session.save()
            return
        }
        res.json({
            success: false,
            message: "Password is wrong"
        })
    })

})

//Log out
router.get('/', (req, res) => {
    req.session.destroy()
    res.json({
        status: true
    })
})

//Get profile type of user
router.get('/type', (req, res) => {
    res.json({
        user: req.session.user,
        userRole: req.session.userRole
    })
})


module.exports = router;