const mongoose = require('mongoose');

const FaultCategorySchema = new mongoose.Schema({
    faultCategoryName: { type: String, required: true }
});

mongoose.model('faultcategories', FaultCategorySchema);