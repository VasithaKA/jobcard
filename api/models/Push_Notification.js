const mongoose = require('mongoose');

const Push_NotificationSchema = new mongoose.Schema({
    token: { type: String, required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true }
});

mongoose.model('push_notifications', Push_NotificationSchema);