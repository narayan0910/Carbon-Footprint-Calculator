const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true, // 'transport', 'energy', 'diet'
    },
    date: {
        type: Date,
        default: Date.now
    },
    details: {
        // generic structure to hold inputs like 'distance', 'fuelType', 'kWh', 'mealType'
        type: Object,
        required: true
    },
    emission: {
        type: Number, // calculated CO2e in kg
        required: true
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
