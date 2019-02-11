const mongoose = require('mongoose');

const ExpertiseSchema = new mongoose.Schema({
    faultCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'faultcategories', required: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true }
});

mongoose.model('expertises', ExpertiseSchema);