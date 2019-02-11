const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');

require('../models/Employee');
const Employee = mongoose.model('employees');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './profile_pictures/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

//Register a User
router.post('/', upload.single('profilePicture'), async (req, res) => {
    const existingemployeeId = await Employee.findOne({ employeeId: req.body.employeeId })
    const existingUserName = await Employee.findOne({ userName: req.body.userName })

    if (existingemployeeId && existingUserName) {
        res.json({
            success: false,
            message: "User Name or Employee Id already in use. Please enter another one"
        })
        return
    }

    if (req.file) {
        bcrypt.hash(req.body.password, 12, (err, hash) => {
            const employee = new Employee({
                employeeId: req.body.employeeId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: hash,
                employeeTypeId: req.body.employeeTypeId,
                departmentId: req.body.departmentId,
                profilePicture: req.file.path,
                expertiseId: req.body.faultCategoryId
            })

            employee.save()
            res.json({
                success: true,
                message: "Employee is Registered!"
            })
        })
    } else {
        bcrypt.hash(req.body.password, 12, (err, hash) => {
            const employee = new Employee({
                employeeId: req.body.employeeId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: hash,
                employeeTypeId: req.body.employeeTypeId,
                departmentId: req.body.departmentId,
                expertiseId: req.body.faultCategoryId
            })

            employee.save()
            res.json({
                success: true,
                message: "Employee is Registered!"
            })
        })
    }
})

//Edit user details
router.patch('/:_id', upload.single('profilePicture'), async (req, res) => {
    const thisEmployee = await Employee.findOne({ employeeId: req.body.employeeId })
    const existingEmployee = await Employee.findOne({ _id: req.params._id, employeeId: req.body.employeeId })
    const thisUser = await Employee.findOne({ userName: req.body.userName })
    const existingUser = await Employee.findOne({ _id: req.params._id, userName: req.body.userName })
    const findEmployeeType = await Employee.findById(req.params._id).populate('employeeTypeId')

    if ((!existingUser && thisUser) || (!existingEmployee && thisEmployee)) {
        res.json({
            success: false,
            message: "Employee ID or User Nameal ready in use. Please enter another one"
        })
        return
    }

    if (findEmployeeType.employeeTypeId.employeeTypeName == 'Administrator' && findEmployeeType.employeeTypeId._id != req.body.employeeTypeId) {
        const admins = await Employee.find({ employeeTypeId: findEmployeeType.employeeTypeId })
        if (admins.length > 1) {
            if (req.file) {
                await Employee.findByIdAndUpdate(req.params._id, { $set: { employeeId: req.body.employeeId, firstName: req.body.firstName, lastName: req.body.lastName, userName: req.body.userName, employeeTypeId: req.body.employeeTypeId, departmentId: req.body.departmentId, profilePicture: req.file.path, expertiseId: req.body.faultCategoryId } })
                    .then(() => {
                        res.json({
                            success: true,
                            message: "Your data is Updated!"
                        })
                    })
            } else {
                await Employee.findByIdAndUpdate(req.params._id, { $set: { employeeId: req.body.employeeId, firstName: req.body.firstName, lastName: req.body.lastName, userName: req.body.userName, employeeTypeId: req.body.employeeTypeId, departmentId: req.body.departmentId, expertiseId: req.body.faultCategoryId } })
                    .then(() => {
                        res.json({
                            success: true,
                            message: "Your data is Updated!"
                        })
                    })
            }

        } else {
            res.json({
                success: false,
                message: "You canot change user type!"
            })
        }
        return
    }

    if (req.file) {
        await Employee.findByIdAndUpdate(req.params._id, { $set: { employeeId: req.body.employeeId, firstName: req.body.firstName, lastName: req.body.lastName, userName: req.body.userName, employeeTypeId: req.body.employeeTypeId, departmentId: req.body.departmentId, profilePicture: req.file.path, expertiseId: req.body.faultCategoryId } })
            .then(() => {
                res.json({
                    success: true,
                    message: "Your data is Updated!"
                })
            })
    } else {
        await Employee.findByIdAndUpdate(req.params._id, { $set: { employeeId: req.body.employeeId, firstName: req.body.firstName, lastName: req.body.lastName, userName: req.body.userName, employeeTypeId: req.body.employeeTypeId, departmentId: req.body.departmentId, expertiseId: req.body.faultCategoryId } })
            .then(() => {
                res.json({
                    success: true,
                    message: "Your data is Updated!"
                })
            })
    }

})

//Delete account
router.delete('/:_id', async (req, res) => {
    const findUserType = await Employee.findById(req.params._id).populate('employeeTypeId', 'employeeTypeName')
    if (findUserType.employeeTypeId.employeeTypeName == 'Administrator') {
        const admins = await Employee.find({ employeeTypeId: findUserType.employeeTypeId._id })
        if (admins.length > 1) {
            await Employee.findByIdAndDelete(req.params._id)
                .then(() => {
                    res.json({
                        success: true
                    })
                })
        } else {
            res.json({
                success: false
            })
        }
    } else {
        await Employee.findByIdAndDelete(req.params._id)
            .then(() => {
                res.json({
                    success: true
                })
            })
    }
})

//get one emloyee details
router.get('/:_id', async (req, res) => {
    const aEmpDetails = await Employee.findById(req.params._id).populate('employeeTypeId').populate('departmentId')
    res.json({
        aEmpDetails: aEmpDetails
    })
})

//get all emloyees details
router.get('/', async (req, res) => {
    const empDetails = await Employee.find().populate('employeeTypeId').populate('departmentId')
    res.json({
        details: empDetails
    })
})

//check employeeId is taken
router.get('/checkEmployeeId/:employeeId', async (req, res) => {
    const unique = await Employee.findOne({ employeeId: req.params.employeeId })
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

//check userName is taken
router.get('/checkUserName/:userName', async (req, res) => {
    const unique = await Employee.findOne({ userName: req.params.userName })
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

//change password
router.patch('/password/:_id', async (req, res) => {
    bcrypt.hash(req.body.password, 12, (err, hash) => {
        Employee.findByIdAndUpdate(req.params._id, { $set: { password: hash } })
        .then(() => {
            res.json({
                success: true,
                message: "Password is Change!"
            })
        })
    })
})



//Get employees details without using an array
router.get('/employeetype/:employeeTypeId', function(req, res) {
    console.log('Get all employee types');
    Employee.find({"employeeTypeId":req.params.employeeTypeId}) 
    .exec(function(err,employees){
        if(err){
            console.log("Error");
        } else {
            res.json(employees);
        }
    });
  });

    //get a machine details without array
router.get('/employeetype/:employeeTypeId/:_id', function(req, res) {
    console.log('Get a machine details');
    Employee.findById(req.params._id) 
    .populate('departmentId')
    .exec(function(err,employee){
        if(err){
            console.log("Error");
        } else {
            res.json(employee);
        }
    });
  });


module.exports = router;