const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    variants: [{ type: String, enum: ['small', 'medium', 'large'], required: true }],
    prices: [{
        small: { type: Number, required: true },
        medium: { type: Number, required: true },
        large: { type: Number, required: true }
    }],
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
