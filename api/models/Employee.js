const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    employeeTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'employeeTypes', required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'departments', required: true },
    profilePicture: { type: String, default: "profile_pictures\\profile_picture.jpg" },
    expertiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'faultcategories', required: false}
});

mongoose.model('employees', EmployeeSchema);