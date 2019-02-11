const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true }
});

mongoose.model('departments', DepartmentSchema);