const mongoose = require('mongoose');

const EmployeeTypeSchema = new mongoose.Schema({
    employeeTypeName: { type: String, required: true }
});

mongoose.model('employeeTypes', EmployeeTypeSchema);