const mongoose = require('mongoose');

const FaultSchema = new mongoose.Schema({
    faultName: { type: String, required: true },
    faultDescription: { type: String, required: false },
    faultCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'faultcategories', required: true }
});

mongoose.model('faults', FaultSchema);