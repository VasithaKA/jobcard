const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    roleNumber: { type: Number, required: true },
    roleName: { type: String, required: true }
});

mongoose.model('roles', RoleSchema);