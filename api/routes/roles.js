const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Role');
const Role = mongoose.model('roles');

//get all userType Details
router.get('/', async (req, res) => {
    const roleDetails = await Role.find({})
    res.status(200).json({
        details: roleDetails
    })
})

module.exports = router;